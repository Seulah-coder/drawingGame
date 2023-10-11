package com.personal.drawingGame.user;

import com.personal.drawingGame.common.util.TypeUtil;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean createUser(User user){
        try {
            Long countUser = this.countUserByRoomCode(user.getRoomCode());
            user.setUserOrder(TypeUtil.intValue(countUser) + 1);
            user.setCorrectCount(0);
            userRepository.save(user);
          return true;
        } catch (Exception e){
            return false;
        }
    }

    public Optional<User> getUser(Long id){
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User user){
        final Optional<User> fetchedUser = userRepository.findById(id);
        if(fetchedUser.isPresent()){
            user.setId(id);
            return userRepository.save(user);
        } else {
            return null;
        }
    }

    public User patchUser(Long id, User user){
        final Optional<User> fetchedUser = userRepository.findById(id);
        if(fetchedUser.isPresent()){
            if(user.getUserName() != null){
                fetchedUser.get().setUserName(user.getUserName());
            }

            if(user.getCorrectCount() != 0){
                fetchedUser.get().setCorrectCount(user.getCorrectCount());
            }
            return userRepository.save(fetchedUser.get());

        } else {
            return null;
        }
    }

    public boolean deleteUser(Long id){
        final Optional<User> fetchedUser = userRepository.findById(id);
        if(fetchedUser.isPresent()){
            userRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public Long countUserByRoomCode(String roomCode){
        return userRepository.countUserByRoomCode(roomCode);
    }

    public List<User> findAllByRoomCode(String roomCode){
        return userRepository.findAllByRoomCode(roomCode);
    }
}
