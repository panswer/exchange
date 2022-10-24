export interface BodyEvent {
  email: string;
  password: string;
}

export interface SignUpRequestEvent {
  body: BodyEvent;
}
