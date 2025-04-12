package project.flowchat.backend.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.UserProfileModel;

import java.util.List;


@Repository
public interface UserProfileRepository extends JpaRepository<UserProfileModel, Integer> {

    /**
     * Check if a user have followed another user before
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @return userIdFrom Integer if a record is found, otherwise null
     */
    @NativeQuery("SELECT user_id_from FROM PROFILE.Follow WHERE user_id_from = ?1 AND user_id_to = ?2")
    Integer checkIfUserFollowed(Integer userIdFrom, Integer userIdTo);

    /**
     * Add a record to the PROFILE.Follow table
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO PROFILE.Follow (user_id_from, user_id_to) VALUES (?1, ?2)")
    void followUser(Integer userIdFrom, Integer userIdTo);

    /**
     * Delete a record from the PROFILE.Follow table
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM PROFILE.Follow WHERE user_id_from = ?1 AND user_id_to = ?2")
    void unfollowUser(Integer userIdFrom, Integer userIdTo);

    /**
     * Check if a user have blocked another user before
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @return userIdFrom Integer if a record is found, otherwise null
     */
    @NativeQuery("SELECT user_id_from FROM PROFILE.Block WHERE user_id_from = ?1 AND user_id_to = ?2")
    Integer checkIfUserBlocked(Integer userIdFrom, Integer userIdTo);

    /**
     * Add a record to the PROFILE.Block table
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO PROFILE.Block (user_id_from, user_id_to) VALUES (?1, ?2)")
    void blockUser(Integer userIdFrom, Integer userIdTo);
}
