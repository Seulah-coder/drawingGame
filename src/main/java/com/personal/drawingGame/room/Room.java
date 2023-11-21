package com.personal.drawingGame.room;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Getter
@Setter
public class Room {

    @Id
    @GeneratedValue
    private Long id;
    @Column
    private String roomCode;
    @Column
    private Date createDate;
    @Column
    private Long roomOwnerId;
}
