import "../css/style.css"
import * as cmn from "./common";

const MSG_TEMPLATE = (t: string, n: string, m: string) => `
  <div class="chat-stream-msg-inner">
    <p class="chat-stream-msg-time">${t}</p>
    <p class="chat-stream-msg-name">${n}</p>
  </div>
  <p class="chat-stream-msg-post">${m}</p>
`;

const ONLINE_TEMPLATE = (n : string) => `
  <span class="material-symbols-outlined">person</span>
  <p>${n}</p>
`;

export const INIT_MSG_INPUT = (s: Session) => {
  const input = document.getElementById("chat-input") as HTMLTextAreaElement;
  const btn_cancel = document.getElementById("chat-btn-cancel") as HTMLElement;
  const stream
    = document.getElementById("chat-stream-msg-container") as HTMLElement;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const skt = s.getConnection();
      if (skt) {
        /* Very simple encoding, just a ';' delimiter */
        skt.send(`${s.getUsername()};${input.value}`);
        stream.appendChild(s.genMessage(input.value));
      }
      input.value = "";
    }
  });
  btn_cancel.addEventListener("click", () => {
    input.value = "";
  });
}

export interface Session {
  isInitialized   : { input: boolean, stream: boolean, channels: boolean },
  goOnline        : () => void,
  getUsername     : () => string,
  setUsername     : (name: string) => cmn.Result<string>,
  getChannel      : () => number | null,
  setChannel      : (n: number) => number | null,
  genMessage      : (m: string, s?: string) => HTMLElement,
  connect         : () => void,
  disconnect      : () => void,
  getConnection   : () => WebSocket | null,
  attachMsgHandle : (fn: (msg: string) => void) => void,
};

export function startSession(): Session {
  let _username                 = "guest";
  let _isOnline                 = false;
  let _channel: number | null   = null;
  let _socket: WebSocket | null = null;
  let _msgHandler: ((...args: any) => void) | null = null;
  return {
    isInitialized : { input: false, stream: false, channels: false, },
    getChannel    : () => _channel,
    setChannel    : (n: number) => { _channel = n; return _channel; },
    getUsername   : () => _username,
    setUsername   : function(name: string) {
      let res_len  = cmn.GUARD_NAME_LENGTH(name);
      let res_name = cmn.GUARD_NAME_CHARS(name);
      if (!res_len.success || !res_name.success) return {
        success : false,
        error   :
          (res_len.error  ? res_len.error + " " : "") +
          (res_name.error ? res_name.error : ""),
      }
      _username = name;
      return { success: true, data: _username };
    },
    genMessage: (m: string, sender?: string) =>  {
      const now  = new Date();
      const hrs  = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const div  = document.createElement("div");
      div.classList.add("chat-stream-msg-box");
      div.innerHTML = MSG_TEMPLATE(
        `${hrs}:${mins}`, sender ? sender : _username, m
      );
      return div;
    },
    goOnline: () => {
      if (!_isOnline) {
        const div = document.createElement("div");
        div.classList.add("chat-stream-online-username");
        div.id = `chat-stream-online-${_username}`;
        div.innerHTML = ONLINE_TEMPLATE(_username);
        (document.getElementById("chat-stream-online") as HTMLElement)
          .appendChild(div);
        _isOnline = true;
      }
    },
    attachMsgHandle: (fn) => _msgHandler = fn,
    connect:
    () => {
      _socket = new WebSocket(`ws://localhost:9003/${_channel}`);
      _socket.onmessage = ({data}) => {
        if (_msgHandler) _msgHandler(data);
      };
    },
    disconnect:    () => { if (_socket) _socket.close(); },
    getConnection: () => _socket,
  }
}
