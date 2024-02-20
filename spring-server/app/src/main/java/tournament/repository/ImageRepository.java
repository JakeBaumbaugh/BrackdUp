package tournament.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;

import tournament.model.Image;

public interface ImageRepository extends ListCrudRepository<Image, Integer> {
    Optional<Image> findByHash(String hash);
    @Query("SELECT id FROM Image")
    List<Integer> findAllIds();
}
