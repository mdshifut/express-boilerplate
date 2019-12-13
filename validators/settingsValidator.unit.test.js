const settingsValidator = require('./settingsValidator');

describe('settingsValidator', () => {
  describe('reservationEmailNotification', () => {
    it('should return an error if reservationEmailNotification is not provided', () => {
      expect.assertions(2);
      const { error } = settingsValidator({});
      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty(
          'context.key',
          'reservationEmailNotification'
        );
      });
    });

    it('should return an error if reservationEmailNotification is not type of boolean', () => {
      expect.assertions(2);
      const { error } = settingsValidator({
        reservationEmailNotification: 'non'
      });
      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'boolean.base');
        expect(detail).toHaveProperty(
          'context.key',
          'reservationEmailNotification'
        );
      });
    });
  }); //
}); // confirmPassword
