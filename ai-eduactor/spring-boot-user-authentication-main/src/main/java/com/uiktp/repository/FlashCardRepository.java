package com.uiktp.repository;

import com.uiktp.model.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@EnableJpaRepositories
@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
    //List<FlashCard> findByCourseId(Long courseId);
    List<FlashCard> findByCourseIdAndUserId(Long courseId, Long userId);

    List<FlashCard> findAllByCourse_Id(Long courseId);

    boolean existsByQuestion(String question);
}
