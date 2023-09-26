package com.personal.drawingGame.user;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean createUser(User user){
        try {

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
            if(user.getName() != null){
                fetchedUser.get().setName(user.getName());
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
}
