package tournament.repository;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.Profile;

public interface ProfileRepository extends ListCrudRepository<Profile, Integer> {
    public Optional<Profile> findByEmail(String email);
}
