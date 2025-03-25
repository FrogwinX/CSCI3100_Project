package project.flowchat.backend.Service;

public class ExceptionService extends Exception {

    /* Security Service Expected Exceptions */
    public static final String USERID_JWT_NOT_MATCH = "User id does not match in JWT";
    public static final String REQUEST_NOT_AVAILABLE = "No request available";
    public static final String INVALID_KEY_LENGTH = "Invalid key length";
    public static final String KEY_NOT_MATCH = "Key not match";
    public static final String KEY_NOT_AVAILABLE = "Key is not available";
    public static final String EXPIRED_KEY = "Key is expired";

    /* Account Service Expected Exceptions */
    public static final String INVALID_USERNAME_FORMAT = "Invalid username format";
    public static final String INVALID_EMAIL_FORMAT = "Invalid email format";
    public static final String USERNAME_NOT_UNIQUE = "Username is not unique";
    public static final String EMAIL_NOT_UNIQUE = "Email is not unique";
    public static final String TOO_MANY_PARAMS = "Too many parameters";
    public static final String ACCOUNT_NOT_ACTIVE = "Account is not active";
    public static final String ACTIVE_ACCOUNT = "Account is active";
    public static final String INCORRECT_PASSWORD = "Account is active but password is not correct";


    public ExceptionService(String message) {
        super(message);
    }

    public static void throwException(String exceptionType) throws ExceptionService {
        throw new ExceptionService(exceptionType);
    }
}
