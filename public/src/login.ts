import "../css/style.css"

type LoginFieldType = "username" | "password" | "confirm password";
type LoginModeType  = "login" | "register";

export interface LoginInterface {
  currentMode:  LoginModeType;
  currentField: LoginFieldType;
  root:         HTMLElement;
  inputLegend:  HTMLLegendElement;
  inputField:   HTMLInputElement;
  errorField:   HTMLElement;
  loginBtn:     HTMLButtonElement;
  registerBtn:  HTMLButtonElement;
  onSubmit:     (n: string, p: string) => Promise<Record<string, unknown>>;
}

export interface Session {
  loggedIn:  boolean;
  username?: string;
  userId?:   number;
}

const _toggler = (t: LoginModeType, IT: LoginInterface) => () => {
  IT.currentField = "username";
  IT.inputLegend.innerText = IT.currentField;
  IT.inputField.value = "";
  IT.inputField.type = "";
  const currBtn = IT[t+"Btn" as keyof LoginInterface] as HTMLButtonElement;
  IT.currentMode = t;
  if (!currBtn.classList.contains("login-btn-on")) {
    const c = t === "login" ? "register" : "login";
    const compBtn = IT[c+"Btn" as keyof LoginInterface] as HTMLButtonElement;
    currBtn.classList.toggle("login-btn-on");
    compBtn.classList.toggle("login-btn-on");
  };
}

function _setField(f: LoginFieldType, IT: LoginInterface) {
  IT.currentField = f;
  IT.inputLegend.innerText = f;
  IT.inputField.value = "";
  IT.inputField.type = f === "password" ? f : "";
}

export function init(S: Session, IT: LoginInterface): void {
  let _p1: string | null = null;
  let _p2: string | null = null;

  IT.loginBtn.addEventListener("click",    _toggler("login", IT));
  IT.registerBtn.addEventListener("click", _toggler("register", IT));

  IT.inputField.addEventListener("keydown", e => {
    if (e.key == "Enter") {
      if (IT.currentMode === "login") {
        switch (IT.currentField) {
          case "username":
            S.username = IT.inputField.value;
            _setField("password", IT);
            IT.errorField.innerText = "";
            break;
          case "password":
            _p1 = IT.inputField.value;
            if (S.username) {
              IT.onSubmit(S.username, _p1)
                .then(res => {
                  if (res.err) {
                    IT.errorField.innerText = "login failure, try again";
                    _setField("username", IT);
                  } else {
                    IT.root.classList.add("hidden");
                  }
                })
            }
            _p1 = null;
            break;
        }
      } else if (IT.currentMode === "register") {
        switch (IT.currentField) {
          case "username":
            S.username = IT.inputField.value;
            IT.currentField = "password";
            IT.inputLegend.innerText = IT.currentField;
            IT.inputField.value = "";
            IT.inputField.type = "password";
            break;
          case "password":
            IT.currentField = "confirm password";
            _p1 = IT.inputField.value;
            IT.inputLegend.innerText = IT.currentField;
            IT.inputField.value = "";
            break;
          case "confirm password":
            _p2 = IT.inputField.value;
            IT.inputField.value = "";
            if (_p1 !== _p2) throw new Error("passwords do not match");
            if (S.username) IT.onSubmit(S.username, _p1);
            _p1 = null; _p2 = null;
            break;
        }
      }
    }
  });
}
