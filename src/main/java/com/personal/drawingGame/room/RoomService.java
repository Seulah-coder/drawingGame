package com.personal.drawingGame.room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;


    public Room createRoom(Room room){
        try {

            String newRoomCode = this.generateRandomCode(6);
            System.out.println("newRoomCode = " + newRoomCode);
            room.setRoomCode(newRoomCode);
            Long id = roomRepository.save(room).getId();
            room.setId(id);
        } catch (Exception e){
            e.printStackTrace();
        }
        return room;
    }


    private String generateRandomCode(int targetStringLength) {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
//        int rightLimit = 57; // normal '9'
        Random random = new Random();

        String generatedString = random.ints(leftLimit,rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
//                .filter(i -> (i <= 57))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        return generatedString.toUpperCase();
    }

    public Optional<Room> getRoom(Long id){
        return roomRepository.findById(id);
    }

    public Room getRoomByRoomCode(String roomCode) {
        return roomRepository.findByRoomCode(roomCode);
    }

    public Room updateRoom(Long id, Room room){
        final Optional<Room> fetchedRoom = roomRepository.findById(id);
        if(fetchedRoom.isPresent()){
            room.setId(id);
            return roomRepository.save(room);
        } else {
            return null;
        }
    }

    public Room patchRoom(Long id, Room room){
        final Optional<Room> fetchedRoom = roomRepository.findById(id);
        if(fetchedRoom.isPresent()){

            return roomRepository.save(fetchedRoom.get());

        } else {
            return null;
        }
    }

    public boolean deleteRoom(Long id){
        final Optional<Room> fetchedRoom = roomRepository.findById(id);
        if(fetchedRoom.isPresent()){
            roomRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

}
