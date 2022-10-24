export interface BodyEvent {
  email: string;
  password: string;
}

export interface SignInRequestEvent {
  body: BodyEvent;
}
