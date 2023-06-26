export interface ResponseOk<T> {
  success: true;
  data?: T;
}

export interface ResponseBad<T> {
  success: false;
  error: T;
}
