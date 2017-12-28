const warnUser = (target, property, action, freeze) => {
  const MUTATION_MESSAGE = freeze
    ? 'can\'t be mutated'
    : 'was mutated';

  console.error(`Error: ${property} on ${JSON.stringify({object: target})} ${MUTATION_MESSAGE} by ${action}.`);
};

module.exports = warnUser;
