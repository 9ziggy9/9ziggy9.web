import "../css/style.css"

const NAME_MIN_LENGTH    = 3;
const NAME_MAX_LENGTH    = 18;
const NAME_ALLOWED_CHARS =
  "abcdefghijklmnopqrstuvwxyz1234567890-~!$%+=_*&#";

interface Result<T> {
  success : boolean;
  data?   : T;
  error?  : string;
}

const MSG_TEMPLATE = (t: string, n: string, m: string) => `
  <div class="chat-stream-msg-inner">
    <p class="chat-stream-msg-time">${t}</p>
    <p class="chat-stream-msg-name">${n}</p>
  </div>
  <p class="chat-stream-msg-post">${m}</p>
`;

const GUARD_NAME_LENGTH = (name: string): Result<string> =>
  NAME_MIN_LENGTH > name.length || name.length > NAME_MAX_LENGTH
    ? { success: false, error: "invalid name length, must be (4-18) characters"}
    : { success: true, data: name };

const GUARD_NAME_CHARS = (name: string): Result<string> =>
  name.toLowerCase()
      .split("")
      .reduce((b, c) => NAME_ALLOWED_CHARS.includes(c) && b, true)
        ? { success: true, data: name }
        : { success: false, error: "string contains invalid character"};

export const INIT_MSG_INPUT = (s: Session) => {
  const input = document.getElementById("chat-input") as HTMLTextAreaElement;
  const btn_cancel = document.getElementById("chat-btn-cancel") as HTMLElement;
  const stream
    = document.getElementById("chat-stream-msg-container") as HTMLElement;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      stream.appendChild(s.genMessage(input.value));
      input.value = "";
    }
  });
  btn_cancel.addEventListener("click", () => {
    input.value = "";
  });
}

export interface Session {
  isInitialized : { input: boolean, stream: boolean },
  getUsername   : () => string,
  setUsername   : (name: string) => Result<string>,
  genMessage    : (m: string) => HTMLElement
};

export function startSession(): Session {
  let _username = "guest";
  return {
    isInitialized : { input: false, stream: false, },
    getUsername   : () => _username,
    setUsername   : function(name: string) {
      let res_len  = GUARD_NAME_LENGTH(name);
      let res_name = GUARD_NAME_CHARS(name);
      if (!res_len.success || !res_name.success) return {
        success : false,
        error   :
          (res_len.error  ? res_len.error + " " : "") +
          (res_name.error ? res_name.error : ""),
      }
      _username = name;
      return { success: true, data: _username };
    },
    genMessage: (m: string) =>  {
      const now  = new Date();
      const hrs  = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const div  = document.createElement("div");
      div.classList.add("chat-stream-msg-box");
      div.innerHTML = MSG_TEMPLATE(`${hrs}:${mins}`, _username, m);
      return div;
    }
  }
}
