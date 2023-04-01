export const PAGE = {
  chatRoom: (accountname) => `../chatRoom?accountname=${accountname}`,
  home: '../home',
  login: '../login',
  loginEmail: '../loginEmail',
  post: (postId) => `../post?postId=${postId}`,
  postUpload: (postId) =>
    postId ? `../postUpload?postId=${postId}` : '../postUpload',
  product: (productId) => `../product?productId=${productId}`,
  productUpload: (productId) =>
    productId ? `../productUpload?productId=${productId}` : '../productUpload',
  profile: (accountname) =>
    accountname ? `../profile?accountname=${accountname}` : '../profile',
  profileFollower: (accountname) =>
    `../profileFollow?accountname=${accountname}&page=follower`,
  profileFollowing: (accountname) =>
    `../profileFollow?accountname=${accountname}&page=following`,
  profileModification: '../profileModification',
  profileSetting: '../profileSetting',
  search: '../search',
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
  minLength: '사용자 이름은 2자 이상이어야 합니다.',
  maxLength: '사용자 이름은 10자 이하여야 합니다.',
  noSpaces: '시작과 끝이 공백이거나, 연속된 공백을 넣을 수 없습니다.',
};

export const ACCOUNTNAME = {
  length: '계정 ID를 입력해 주세요.',
  wrongPattern: '영문, 숫자, 마침표, 언더바만 사용 가능합니다.',
  available: '사용 가능한 계정ID 입니다.',
};

export const REGISTER = {
  omitEmailPassword: '이메일과 비밀번호가 누락되었습니다.',
  success: '가입이 완료되었습니다.',
  requireValidation: '입력한 항목들을 다시 확인해주세요.',
};

export const IMAGE = {
  sizeInMB: (number) => 1024 * 1024 * number,
  allowedTypes: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],
  externalUrl: process.env.EXTERNAL_IMAGE_URL,
  resizedUrl: process.env.RESIZED_IMAGE_URL,
  format: {
    gif: 'gif',
  },
};

export const IMAGE_ERROR = {
  count: '이미지는 3개까지만 첨부할 수 있습니다.',
  size: '이미지의 크기가 3MB를 초과했습니다.',
  format: 'jpg, gif, png, jpeg 형식의 이미지만 등록할 수 있습니다.',
};

export const BUTTON = {
  post: (isMine) => (isMine ? ['update', 'delete'] : ['report']),
  comment: (isMine) => (isMine ? ['delete'] : ['report']),
  product: () => ['update', 'delete'],
  header: () => ['logout'],
};

export const ACTION = {
  update: '수정',
  delete: '삭제',
  report: '신고',
  cancel: '취소',
  logout: '로그아웃',
};

export const POST_MESSAGE = {
  noPost: '게시글이 없습니다.',
};

export const PRODUCT_ERROR = {
  noProduct: '판매 중인 상품이 없습니다.',
  nameRequired: '상품명을 입력하세요.',
  nameMinLength: '상품명은 2자 이상이어야 합니다.',
  nameMaxLength: '상품명은 15자 이하여야 합니다.',
  priceRequired: '가격은 숫자로 입력해야 합니다.',
  priceShouldBeNumber: '가격은 숫자로 입력해야 합니다.',
  linkRequired: '판매 링크를 입력하세요.',
  linkPattern: 'url 형식(ex. naver.com)으로 입력해주세요.',
};

export const REGEX = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  accountname: /^[a-zA-Z0-9._]+$/,
  spaces: /^\s|\s{2,}|\s$/,
  url: /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  image: /\d+\.(jpeg|jpg|png|gif)/,
};
