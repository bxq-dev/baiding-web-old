export enum ApiCode {
  OK = 200,
  ErrNeedToLogin = 401,
  ErrNeedToLogin401 = '401',
  ErrNotFound = 404,
  ErrUnauthorized = 20001,
  ErrExpiredToken = 20004,
  ErrSigninEmptyPassword = 20100,
  ErrSigninInvalidPassword = 20101,
  ErrSigninInvalidSmsCode = 20102,
  ErrPleaseWaitAMoment = 200200,
  ErrUserMobileAlreadyBinded = 200201,
  ErrUserMobileUsedByOthers = 200202,
  ErrInvalidActivateCode = 200203,
  ErrActivateCodeAlreadyUsed = 200204,
  ErrUserMobileNeedBind = 200205,
  ErrUnpay = 400001,
  ErrNoNeedToPay = 400002,
  ErrUnknownPaymentPlatform = 400003,
  ErrItemOutOfStock = 400004,
  ErrItemCannotBuy = 400005,
  ErrOrderItemIncorrect = 400100,
  ErrAlreadyPaid = 400101,
  ErrBillingClosed = 400102,
  ErrOrderUnabledClosed = 400103,
  ErrOrderDuplicateItem = 400104,
  ErrOrderNeedProcessOthers = 400105,
  ErrOrderDiscountNotAvailable = 400110,
  ErrOrderDiscountNotUsed = 400111,
  ErrOrderDiscountReachLimit = 400112,
  ErrOrderDiscountCannotUsedWithOther = 400114,
  ErrUnknown = 90000,
}

export const ApiErrorMessage: {[key: number]: string} = {
  [ApiCode.ErrNeedToLogin]: '请登录',
  [ApiCode.ErrUnauthorized]: '请登录',
  // [ApiCode.ErrNotFound]: '资源不存在',
  [ApiCode.ErrUserMobileAlreadyBinded]: '您已绑定过手机',
  [ApiCode.ErrUserMobileUsedByOthers]: '手机已被其他用户绑定，请使用手机号码登录',
  [ApiCode.ErrSigninInvalidSmsCode]: '验证码错误',
  [ApiCode.ErrSigninEmptyPassword]: '密码未设置，请点忘记密码重置',
  [ApiCode.ErrPleaseWaitAMoment]: '请求过于频繁，请稍后重试',
  [ApiCode.ErrUnpay]: '请支付',
  [ApiCode.ErrNoNeedToPay]: '无需支付',
  [ApiCode.ErrUnknownPaymentPlatform]: '无法识别支付平台',
  [ApiCode.ErrAlreadyPaid]: '订单已支付',
  [ApiCode.ErrBillingClosed]: '订单已关闭',
  [ApiCode.ErrInvalidActivateCode]: '激活码不存在，或者已被用过',
  [ApiCode.ErrActivateCodeAlreadyUsed]: '激活码已被激活',
  [ApiCode.ErrUnknown]: '服务器错误',
  [ApiCode.ErrOrderNeedProcessOthers]: '您有其他订单未处理',
  [ApiCode.ErrOrderDuplicateItem]: '您的订单有重复项目',
  [ApiCode.ErrOrderDiscountNotAvailable]: '优惠不可用',
  [ApiCode.ErrOrderDiscountReachLimit]: '优惠超限',
  [ApiCode.ErrOrderUnabledClosed]: '订单已关闭',
  [ApiCode.ErrUserMobileNeedBind]: '请先绑定手机',
  [ApiCode.ErrOrderItemIncorrect]: '订单错误',
  [ApiCode.ErrOrderDiscountNotUsed]: '优惠券不可用',
  [ApiCode.ErrOrderDiscountCannotUsedWithOther]: '优惠券不可与其他优惠同时使用',
  [ApiCode.ErrSigninInvalidPassword]: '手机号不存在或验证码错误',
};

export const SigninErrorMessage = {
  [ApiCode.ErrNotFound]: '手机号不存在',
};
