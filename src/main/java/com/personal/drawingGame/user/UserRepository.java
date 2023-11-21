package com.personal.drawingGame.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Long countUserByRoomCode(String roomCode);

    List<User> findAllByRoomCodeOrderByUserOrder(String roomCode);

}
