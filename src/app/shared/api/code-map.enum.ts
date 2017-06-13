export enum ApiError{
  ErrPleaseWaitAMoment = 200200,
  ErrUserMobileAlreadyBinded = 200201,
  ErrUserMobileUsedByOthers = 200202,
  ErrUnpay = 400001,
  ErrUnnecessaryToPay = 400002,
  ErrUnknownPaymentPlatform = 400003,
  ErrAlreadyPaid = 400101,
  ErrBillingClosed = 400102,
}

export const ApiErrorMessage = {
  [ApiError.ErrPleaseWaitAMoment]: '请求过于频繁，请稍后重试',
  [ApiError.ErrUserMobileAlreadyBinded]: '您已绑定过手机',
  [ApiError.ErrUserMobileUsedByOthers]: '手机已被其他用户绑定',
  [ApiError.ErrUnpay]: '请支付',
  [ApiError.ErrUnnecessaryToPay]: '无需支付',
  [ApiError.ErrUnknownPaymentPlatform]: '无法识别支付平台',
  [ApiError.ErrAlreadyPaid]: '订单已支付',
  [ApiError.ErrBillingClosed]: '订单已关闭',
};
