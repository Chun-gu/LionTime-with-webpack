export default class InputValidator {
  #validators = [];
  #isValid;
  #cause;

  required(cause) {
    this.#validators.push({
      validator: (target) => {
        if (!target) return false;
        return true;
      },
      cause,
    });

    return this;
  }

  number(cause) {
    this.#validators.push({
      validator: (target) => {
        if (!/^[0-9]+$/.test(target)) return false;
        return true;
      },
      cause,
    });

    return this;
  }

  minLength(length, cause) {
    this.#validators.push({
      validator: (target) => {
        if (target.length < length) return false;
        return true;
      },
      cause,
    });

    return this;
  }

  maxLength(length, cause) {
    this.#validators.push({
      validator: (target) => {
        if (target.length > length) return false;
        return true;
      },
      cause,
    });

    return this;
  }

  match(regex, cause) {
    this.#validators.push({
      validator: (target) => {
        if (!regex.test(target)) return false;
        return true;
      },
      cause,
    });

    return this;
  }

  notMatch(regex, cause) {
    this.#validators.push({
      validator: (target) => {
        if (regex.test(target)) return false;
        return true;
      },
      cause,
    });

    return this;
  }

  validate(target) {
    for (const { validator, cause } of this.#validators) {
      const isValid = validator(target);

      this.#isValid = isValid;
      this.#cause = isValid ? undefined : cause;
      if (!isValid) break;
    }

    return { isValid: this.#isValid, cause: this.#cause };
  }
}
