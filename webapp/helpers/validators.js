export function required(value) {
  return !value ? ['This field cannot be empty'] : [];
}

export function name(value) {
  return value && value.match(/^[a-zA-Z0-9 ]*$/gi) ? [] : ['This field can only contain alphabets or digits'];
}

export function version(value) {
  return value && value.match(/^v[0-9]*$/gi) ? [] : ['Version should be of format v*. Eg: v2'];
}