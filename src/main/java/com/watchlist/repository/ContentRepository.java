package com.watchlist.repository;

import com.watchlist.model.Content;
import com.watchlist.model.enums.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByType(ContentType type);
    List<Content> findByGenreContainingIgnoreCase(String genre);
    List<Content> findByPlatformIgnoreCase(String platform);

    @Query("SELECT c FROM Content c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Content> searchByTitleOrDescription(@Param("query") String query);

    List<Content> findByReleaseYear(Integer releaseYear);
}
