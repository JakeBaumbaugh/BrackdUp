package tournament.repository;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.RevokedJwt;

public interface RevokedJwtRepository extends ListCrudRepository<RevokedJwt, String> {
    
}
