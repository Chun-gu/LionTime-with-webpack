export class HTTPError extends Error {
  constructor(error) {
    super(error.message || '요청에 오류가 발생했습니다.');
    this.name = '요청 오류';
  }
}

export class ResponseError extends Error {
  constructor(error) {
    super(error.message || '응답에 오류가 발생했습니다.');
    this.name = '응답 오류';
  }
}
