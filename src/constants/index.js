export const PAGE = {
  home: 'home',
  profileSetting: 'profileSetting',
  loginEmail: 'loginEmail',
};

export const EMAIL = {
  wrongPattern: '이메일 형식이 아닙니다.',
  available: '사용 가능한 이메일 입니다.',
};

export const PASSWORD = {
  minLength: '비밀번호는 6자 이상이어야 합니다',
  maxLength: '비밀번호는 16자 이하이어야 합니다',
};

export const USERNAME = {
  length: '사용자 이름은 2 ~ 10자이어야 합니다.',
  noSpaces: '시작과 끝이 공백이거나, 연속된 공백을 넣을 수 없습니다.',
};

export const ACCOUNTNAME = {
  wrongPattern: '영문, 숫자, 마침표, 언더바만 사용 가능합니다.',
  available: '사용 가능한 계정ID 입니다.',
};

export const REGISTER = {
  omitEmailPassword: '이메일과 비밀번호가 누락되었습니다.',
  success: '가입이 완료되었습니다.',
  requireValidation: '입력한 항목들을 다시 확인해주세요.',
};

export const IMAGE = {
  size3MB: 1024 * 1024 * 3,
  allowedTypes: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],
};

export const IMAGE_ERROR = {
  size: '이미지의 크기가 3MB를 초과했습니다.',
  format: 'jpg, gif, png, jpeg 형식의 이미지만 등록할 수 있습니다.',
};

export const BUTTON = {
  post: (isMine) => (isMine ? ['update', 'delete'] : ['report']),
  comment: (isMine) => (isMine ? ['delete'] : ['report']),
};

export const ACTION = {
  update: '수정',
  delete: '삭제',
  report: '신고',
};

export const REGEX = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  accountname: /^[a-zA-Z0-9._]+$/,
};
