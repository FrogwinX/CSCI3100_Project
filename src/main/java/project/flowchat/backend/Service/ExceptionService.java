package project.flowchat.backend.Service;

public class ExceptionService extends Exception {

    /* Security Service Expected Exceptions */
    public static final String USERID_JWT_NOT_MATCH = "User id does not match in JWT";
    public static final String REQUEST_NOT_AVAILABLE = "No request available";
    public static final String INVALID_KEY_LENGTH = "Invalid validation code.";
    public static final String KEY_NOT_MATCH = "Invalid validation code.";
    public static final String KEY_NOT_AVAILABLE = "This validation code has expired.";
    public static final String EXPIRED_KEY = "This validation code has expired.";

    /* Account Service Expected Exceptions */
    public static final String INVALID_USERNAME_FORMAT = "Invalid username format.";
    public static final String INVALID_EMAIL_FORMAT = "Invalid email address format.";
    public static final String USERNAME_NOT_UNIQUE = "This username has been used.";
    public static final String EMAIL_NOT_UNIQUE = "This email address has been used.";
    public static final String TOO_MANY_PARAMS = "Too many parameters";
    public static final String ACCOUNT_NOT_ACTIVE = "Incorrect username, email address or password.";
    public static final String ACTIVE_ACCOUNT = "This email address has been used.";
    public static final String INCORRECT_PASSWORD = "Incorrect username, email address or password.";

    /* Forum Service Expected Exceptions*/
    public static final String INVALID_POST_CREATOR = "This post or comment is not created by you.";
    public static final String POST_DELETED = "This post or comment has been deleted.";
    public static final String MAKE_COMMENT_TO_A_POST = "Cannot make a comment become a post.";
    public static final String ALREADY_LIKED_THIS_POST = "Already liked this post or comment.";
    public static final String ALREADY_DISLIKED_THIS_POST = "Already disliked this post or comment.";
    public static final String POST_NOT_LIKED = "Has not liked this post or comment before.";
    public static final String POST_NOT_DISLIKED = "Has not disliked this post or comment before.";
    public static final String INVALID_POST_OPTION = "Invalid post action.";

    /* Image Service Expected Exceptions */
    public static final String FILE_NOT_IMAGE = "The file is not an image.";
    public static final String IMAGE_ALREADY_USED = "This image has been used.";
    public static final String IMAGE_COMPRESSION_ERROR = "This image cannot be compressed under 5MB.";

    /* Chat Service Expected Exceptions */
    public static final String INVALID_ACTION_TYPE = "This action type is invalid.";
    public static final String MESSAGE_ALREADY_READ = "This message has already been read.";
    public static final String MESSAGE_ALREADY_DELETED = "This message has already been deleted.";


    /* Profile Service Expected Exceptions */
    public static final String CANNOT_FOLLOW_YOURSELF = "Cannot follow yourself.";
    public static final String USER_DELETED = "The user has been deleted.";
    public static final String USER_ALREADY_FOLLOWED = "Have already followed this user.";
    public static final String USER_NOT_FOLLOWED = "Have not followed this user before.";
    public static final String CANNOT_BLOCK_YOURSELF = "Cannot block yourself.";
    public static final String USER_ALREADY_BLOCKED = "Have already blocked this user.";
    public static final String USER_NOT_BLOCKED = "Have not blocked this user before.";

    public ExceptionService(String message) {
        super(message);
    }

    public static void throwException(String exceptionType) throws ExceptionService {
        throw new ExceptionService(exceptionType);
    }
}
