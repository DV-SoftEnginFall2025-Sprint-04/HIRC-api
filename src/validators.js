function isNum(n) { return Number.isFinite(n); }

function validatePayload(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Missing JSON body.' };
  }

  const age = Number(body.age);
  const weightLb = Number(body.weightLb);
  const h = body.height || {};
  const bp = body.bloodPressure || {};
  const fh = body.familyHistory || {};

  const feet = Number(h.feet);
  const inches = Number(h.inches);
  const systolic = Number(bp.systolic);
  const diastolic = Number(bp.diastolic);

  if (!(isNum(age) && age >= 0 && age <= 100))
    return { valid: false, message: 'Age must be 0–100.' };

  if (!(isNum(weightLb) && weightLb >= 50 && weightLb <= 500))
    return { valid: false, message: 'Weight must be 50–500 lb.' };

  if (!(isNum(feet) && feet >= 2 && feet <= 8))
    return { valid: false, message: 'Height feet must be 2–8.' };

  if (!(isNum(inches) && inches >= 0 && inches <= 11))
    return { valid: false, message: 'Height inches must be 0–11.' };

  if (feet * 12 + inches < 24)
    return { valid: false, message: 'Minimum height is 2 feet.' };

  if (!(isNum(systolic) && systolic >= 70 && systolic <= 250))
    return { valid: false, message: 'Systolic must be 70–250.' };

  if (!(isNum(diastolic) && diastolic >= 40 && diastolic <= 150))
    return { valid: false, message: 'Diastolic must be 40–150.' };

  return { valid: true };
}

module.exports = { validatePayload };
