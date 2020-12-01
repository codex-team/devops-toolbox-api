import { MessageFormatError, MessageParseError } from './errors';
import { NewMessage, PossibleInvalidMessage } from './types';

/**
 * Provides methods for validating message
 */
export default class MessageValidator {
  /**
   * Check if passed message fits the protocol format.
   * Will throw an error if case of problems.
   * If everything is ok, return void
   *
   * @param message - string got from client by socket
   */
  public static validateMessage(message: unknown): void {
    /**
     * Check for message type
     */
    if (typeof message !== 'string') {
      throw new MessageParseError('Unsupported data');
    }

    /**
     * Check for JSON validness
     */
    let parsedMessage: NewMessage;

    try {
      parsedMessage = JSON.parse(message) as NewMessage;
    } catch (parsingError) {
      throw new MessageParseError(parsingError.message);
    }

    /**
     * Check for required fields
     */
    const requiredMessageFields = ['messageId', 'type', 'payload'];

    requiredMessageFields.forEach((field) => {
      if ((parsedMessage as unknown as PossibleInvalidMessage)[field] === undefined) {
        throw new MessageFormatError(`'${field}' field missed`);
      }
    });

    /**
     * Check fields type
     */
    const fieldTypes = {
      messageId: 'string',
      type: 'string',
      payload: 'object',
    };

    Object.entries(fieldTypes).forEach(([name, type]) => {
      const value = (parsedMessage as unknown as PossibleInvalidMessage)[name];

      // eslint-disable-next-line valid-typeof
      if (typeof value !== type) {
        throw new MessageFormatError(`'${name}' should be ${type === 'object' ? 'an' : 'a'} ${type}`);
      }
    });

    /**
     * Check message id for validness
     */
    if (!MessageValidator.isMessageIdValid(parsedMessage.messageId)) {
      throw new MessageFormatError('Invalid message id');
    }
  }

  /**
   * Check message id for validness.
   * It should be a 10 length URL-friendly string
   *
   * @param messageId - id to check
   */
  private static isMessageIdValid(messageId: string): boolean {
    if (messageId.length !== 10) {
      return false;
    }

    if (!messageId.match(/^[A-Za-z0-9_-]{10}$/)) {
      return false;
    }

    return true;
  }
}
