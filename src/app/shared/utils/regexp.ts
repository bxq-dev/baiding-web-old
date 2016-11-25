export class RegexpConst {
  static email = /^[a-z0-9_]+(\.?[a-z0-9-_])*?@([a-zA-Z0-9]([a-zA-Z0-9\-]*?[a-zA-Z0-9])?\.)+[a-zA-Z]{2,20}$/i;
  static username = /^[a-z][a-z0-9-]{3,18}[a-z0-9]$/;
  static mobile = /(^(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/;  // from https://github.com/VincentSit/ChinaMobilePhoneNumberRegex
  static phone = /^((086-)?0[0-9]{2,3}-[0-9]{7,8}\;)*((086-)?0[0-9]{2,3}-[0-9]{7,8})$/;
  static phoneOrMobile = /(^((086-)?0[0-9]{2,3}-[0-9]{7,8}\;)*((086-)?0[0-9]{2,3}-[0-9]{7,8})$)||(^(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/;
}