/**
 * @param {number|string} priceEm 
 * @param {number|string} priceRub 
 * @returns {object} Object with info about type and value of price
 */
export function price(priceEm, priceRub) {
  // Слабое место. Лучше изменить структуру хранения в БД.
  // Предлагаемая трансформация ниже
  const em = +priceEm;
  const rub = +priceRub;
  return {
    type: rub === 0 ? "emerald" : "coin",
    value: em || rub,
  };
}