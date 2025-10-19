function inchesFromFeetIn({ feet, inches }) {
  const f = Number(feet) || 0;
  const i = Number(inches) || 0;
  return f * 12 + i;
}

// BMI calculation (weight_lb / height_in^2) * 703
function bmiFromImperial({ heightIn, weightLb }) {
  const h2 = Math.pow(heightIn, 2);
  return Number(((weightLb / h2) * 703).toFixed(2));
}

function bmiPoints(bmi) {
  if (bmi < 25) return { category: 'normal', points: 0 };
  if (bmi < 30) return { category: 'overweight', points: 30 };
  return { category: 'obese', points: 75 };
}

function agePoints(age) {
  if (age < 30) return 0;
  if (age < 45) return 10;
  if (age < 60) return 20;
  return 30;
}

function bpCategoryPoints(sys, dia) {
  if (sys > 180 || dia > 120) return { category: 'crisis', points: 100 };
  if (sys >= 140 || dia >= 90) return { category: 'stage2', points: 75 };
  if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89))
    return { category: 'stage1', points: 30 };
  if (sys >= 120 && sys <= 129 && dia < 80)
    return { category: 'elevated', points: 15 };
  return { category: 'normal', points: 0 };
}

function familyPoints({ diabetes, cancer, alzheimers }) {
  let pts = 0;
  const list = [];
  if (diabetes) { pts += 10; list.push('diabetes'); }
  if (cancer) { pts += 10; list.push('cancer'); }
  if (alzheimers) { pts += 10; list.push('Alzheimer\'s'); }
  return { pts, list };
}

function riskCategory(total) {
  if (total <= 20) return 'low';
  if (total <= 50) return 'moderate';
  if (total <= 75) return 'high';
  return 'uninsurable';
}

function computeRisk(payload) {
  const { age, height, weightLb, bloodPressure, familyHistory } = payload;

  const heightIn = inchesFromFeetIn(height);
  const bmi = bmiFromImperial({ heightIn, weightLb });

  const agePts = agePoints(age);
  const { category: bmiCat, points: bmiPts } = bmiPoints(bmi);
  const { category: bpCat, points: bpPts } = bpCategoryPoints(
    bloodPressure.systolic,
    bloodPressure.diastolic
  );
  const { pts: famPts, list: famList } = familyPoints(familyHistory);

  const total = agePts + bmiPts + bpPts + famPts;
  const category = riskCategory(total);

  return {
    inputs: {
      age,
      heightIn,
      weightLb,
      bmi,
      bpCategory: bpCat,
      family: famList,
    },
    points: {
      age: agePts,
      bmi: bmiPts,
      bloodPressure: bpPts,
      family: famPts,
      total,
    },
    riskCategory: category,
  };
}

module.exports = {
  computeRisk,
};
