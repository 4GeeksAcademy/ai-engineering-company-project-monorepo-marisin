document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("applicationForm");
  const successBox = document.getElementById("formSuccess");
  const warningBox = document.getElementById("lowVolumeWarning");

  const fields = {
    companyName: document.getElementById("companyName"),
    contactPerson: document.getElementById("contactPerson"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    website: document.getElementById("website"),
    country: document.getElementById("country"),
    productType: document.getElementById("productType"),
    monthlyVolume: document.getElementById("monthlyVolume"),
    comments: document.getElementById("comments"),
    privacy: document.getElementById("privacy")
  };

  const servicesInputs = Array.from(document.querySelectorAll('input[name="services"]'));
  const current3plInputs = Array.from(document.querySelectorAll('input[name="current3pl"]'));

  const commentsCounter = document.getElementById("commentsCounter");

  function setError(errorId, message) {
    const errorNode = document.getElementById(errorId);
    if (!errorNode) return;

    if (message) {
      errorNode.textContent = message;
      errorNode.classList.remove("hidden");
    } else {
      errorNode.textContent = "";
      errorNode.classList.add("hidden");
    }
  }

  function markInput(input, hasError) {
    if (!input) return;
    if (hasError) {
      input.classList.add("border-red-500", "ring-2", "ring-red-200");
      input.setAttribute("aria-invalid", "true");
    } else {
      input.classList.remove("border-red-500", "ring-2", "ring-red-200");
      input.removeAttribute("aria-invalid");
    }
  }

  function validateCompanyName() {
    const value = fields.companyName.value.trim();
    const message = value.length >= 2 ? "" : "El nombre de la empresa debe tener al menos 2 caracteres";
    setError("companyNameError", message);
    markInput(fields.companyName, Boolean(message));
    return !message;
  }

  function validateContactPerson() {
    const value = fields.contactPerson.value.trim();
    const hasTwoWords = /^\S+\s+\S+/.test(value);
    const message = hasTwoWords ? "" : "Ingresa nombre y apellido del contacto";
    setError("contactPersonError", message);
    markInput(fields.contactPerson, Boolean(message));
    return !message;
  }

  function validateEmail() {
    const value = fields.email.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const message = isValid ? "" : "Ingresa un email corporativo valido (ejemplo: nombre@empresa.com)";
    setError("emailError", message);
    markInput(fields.email, Boolean(message));
    return !message;
  }

  function validatePhone() {
    const value = fields.phone.value.trim();
    const isValid = /^\+\d{1,3}[\s\d-]{7,}$/.test(value);
    const message = isValid ? "" : "El telefono debe incluir codigo de pais (ejemplo: +1 213 555 0147)";
    setError("phoneError", message);
    markInput(fields.phone, Boolean(message));
    return !message;
  }

  function validateWebsite() {
    const value = fields.website.value.trim();
    if (!value) {
      setError("websiteError", "");
      markInput(fields.website, false);
      return true;
    }

    let isValid = /^https?:\/\//.test(value);
    if (isValid) {
      try {
        new URL(value);
      } catch {
        isValid = false;
      }
    }

    const message = isValid ? "" : "Si incluyes sitio web, debe ser una URL valida";
    setError("websiteError", message);
    markInput(fields.website, Boolean(message));
    return !message;
  }

  function validateCountry() {
    const message = fields.country.value ? "" : "Selecciona el pais de operacion principal";
    setError("countryError", message);
    markInput(fields.country, Boolean(message));
    return !message;
  }

  function validateProductType() {
    const message = fields.productType.value ? "" : "Selecciona el tipo de producto que manejas";
    setError("productTypeError", message);
    markInput(fields.productType, Boolean(message));
    return !message;
  }

  function validateMonthlyVolume() {
    const message = fields.monthlyVolume.value ? "" : "Selecciona el volumen mensual estimado";
    setError("monthlyVolumeError", message);
    markInput(fields.monthlyVolume, Boolean(message));
    return !message;
  }

  function validateServices() {
    const checked = servicesInputs.some((input) => input.checked);
    const message = checked ? "" : "Selecciona al menos un servicio de interes";
    setError("servicesError", message);
    servicesInputs.forEach((input) => input.setAttribute("aria-invalid", checked ? "false" : "true"));
    return checked;
  }

  function validateCurrent3pl() {
    const checked = current3plInputs.some((input) => input.checked);
    const message = checked ? "" : "Indica si actualmente trabajas con otro proveedor logistico";
    setError("current3plError", message);
    current3plInputs.forEach((input) => input.setAttribute("aria-invalid", checked ? "false" : "true"));
    return checked;
  }

  function validateComments() {
    const value = fields.comments.value;
    commentsCounter.textContent = `${value.length}/500`;

    if (value.length > 500) {
      const remaining = 500 - value.length;
      const message = `Los comentarios no pueden exceder 500 caracteres (quedan ${remaining})`;
      setError("commentsError", message);
      markInput(fields.comments, true);
      return false;
    }

    setError("commentsError", "");
    markInput(fields.comments, false);
    return true;
  }

  function validatePrivacy() {
    const message = fields.privacy.checked ? "" : "Debes aceptar la politica de privacidad para continuar";
    setError("privacyError", message);
    fields.privacy.setAttribute("aria-invalid", fields.privacy.checked ? "false" : "true");
    return !message;
  }

  function updateLowVolumeWarning() {
    const showWarning = fields.monthlyVolume.value === "0-100" && fields.productType.value !== "";
    warningBox.classList.toggle("hidden", !showWarning);
  }

  function validateAll() {
    const checks = [
      validateCompanyName(),
      validateContactPerson(),
      validateEmail(),
      validatePhone(),
      validateWebsite(),
      validateCountry(),
      validateProductType(),
      validateMonthlyVolume(),
      validateServices(),
      validateCurrent3pl(),
      validateComments(),
      validatePrivacy()
    ];

    updateLowVolumeWarning();
    return checks.every(Boolean);
  }

  fields.companyName.addEventListener("input", validateCompanyName);
  fields.companyName.addEventListener("blur", validateCompanyName);

  fields.contactPerson.addEventListener("input", validateContactPerson);
  fields.contactPerson.addEventListener("blur", validateContactPerson);

  fields.email.addEventListener("input", validateEmail);
  fields.email.addEventListener("blur", validateEmail);

  fields.phone.addEventListener("input", validatePhone);
  fields.phone.addEventListener("blur", validatePhone);

  fields.website.addEventListener("input", validateWebsite);
  fields.website.addEventListener("blur", validateWebsite);

  fields.country.addEventListener("change", () => {
    validateCountry();
    updateLowVolumeWarning();
  });

  fields.productType.addEventListener("change", () => {
    validateProductType();
    updateLowVolumeWarning();
  });

  fields.monthlyVolume.addEventListener("change", () => {
    validateMonthlyVolume();
    updateLowVolumeWarning();
  });

  servicesInputs.forEach((input) => {
    input.addEventListener("change", validateServices);
  });

  current3plInputs.forEach((input) => {
    input.addEventListener("change", validateCurrent3pl);
  });

  fields.comments.addEventListener("input", validateComments);
  fields.comments.addEventListener("blur", validateComments);

  fields.privacy.addEventListener("change", validatePrivacy);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successBox.classList.add("hidden");

    if (!validateAll()) {
      return;
    }

    successBox.classList.remove("hidden");
    form.reset();
    commentsCounter.textContent = "0/500";
    warningBox.classList.add("hidden");
    [
      "companyNameError",
      "contactPersonError",
      "emailError",
      "phoneError",
      "websiteError",
      "countryError",
      "productTypeError",
      "monthlyVolumeError",
      "servicesError",
      "current3plError",
      "commentsError",
      "privacyError"
    ].forEach((id) => setError(id, ""));
    Object.values(fields).forEach((input) => markInput(input, false));
  });

  const clearButton = document.getElementById("clearButton");
  clearButton.addEventListener("click", () => {
    successBox.classList.add("hidden");
    warningBox.classList.add("hidden");
    commentsCounter.textContent = "0/500";
    [
      "companyNameError",
      "contactPersonError",
      "emailError",
      "phoneError",
      "websiteError",
      "countryError",
      "productTypeError",
      "monthlyVolumeError",
      "servicesError",
      "current3plError",
      "commentsError",
      "privacyError"
    ].forEach((id) => setError(id, ""));
    Object.values(fields).forEach((input) => markInput(input, false));
  });
});
