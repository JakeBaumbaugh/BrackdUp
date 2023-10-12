package tournament.repository;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.Song;

public interface SongRepository extends ListCrudRepository<Song, Integer> {
    
}
