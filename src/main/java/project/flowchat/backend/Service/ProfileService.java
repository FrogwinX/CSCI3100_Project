package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.flowchat.backend.Model.UserProfileModel;
import project.flowchat.backend.Repository.UserAccountRepository;
import project.flowchat.backend.Repository.UserProfileRepository;

@AllArgsConstructor
@Service
public class ProfileService {

    @Autowired
    private final UserProfileRepository userProfileRepository;
    private final SecurityService securityService;
    private final UserAccountRepository userAccountRepository;

    /**
     * Follow a user
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @throws Exception CANNOT_FOLLOW_YOURSELF, USER_DELETED, USER_ALREADY_FOLLOWED
     */
    public void followUser(Integer userIdFrom, Integer userIdTo) throws Exception{
        securityService.checkUserIdWithToken(userIdFrom);
        if (userIdFrom == userIdTo) {
            ExceptionService.throwException(ExceptionService.CANNOT_FOLLOW_YOURSELF);
        }
        if (!userAccountRepository.findIfUserActive(userIdTo)) {
            ExceptionService.throwException(ExceptionService.USER_DELETED);
        }
        if (userProfileRepository.checkIfUserFollowed(userIdFrom, userIdTo) != null) {
            ExceptionService.throwException(ExceptionService.USER_ALREADY_FOLLOWED);
        }
        userProfileRepository.followUser(userIdFrom, userIdTo);
    }
}
