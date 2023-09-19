-- R__insert-christmas-tournament-2021

DO $$
BEGIN

IF (SELECT id FROM tournament WHERE name = 'Christmas Tournament 2021') IS NULL THEN

    INSERT INTO tournament (id, name)
        VALUES (1, '2021 Christmas Tournament');

    -- Songs
    INSERT INTO song (id, title, artist, spotify) --1
        VALUES (1, 'Jingle Bell Rock', 'Bobby Helms', 'https://open.spotify.com/track/7vQbuQcyTflfCIOu3Uzzya?si=b8f8c64154124579');
    INSERT INTO song (id, title, artist, spotify) --2
        VALUES (2, 'Let It Snow! Let It Snow! Let It Snow!', 'Frank Sinatra', 'https://open.spotify.com/track/4kKdvXD0ez7jp1296JmAts?si=f87b5b45af234fc2');
    INSERT INTO song (id, title, artist, spotify) --3
        VALUES (3, 'Christmas Eve / Sarajevo 12/24', 'Trans-Siberian Orchestra', 'https://open.spotify.com/track/3sBnSBnzpEYKpJYGsAIbup?si=596743a20ef74aec');
    INSERT INTO song (id, title, artist, spotify) --4
        VALUES (4, 'When Christmas Comes to Town', 'Matthew Hall, Meagan Moore', 'https://open.spotify.com/track/2dz0u8FY3EYQqRsiW7qR4v?si=ffb2c532c28f4878');
    INSERT INTO song (id, title, artist, spotify) --5
        VALUES (5, 'Cold December Night', 'Michael Bublé', 'https://open.spotify.com/track/23EvkivHtoFgkSK5pckvwq?si=a56763bf318543d3');
    INSERT INTO song (id, title, artist, spotify) --6
        VALUES (6, 'Oh Come All Ye Faithful', 'Twisted Sister', 'https://open.spotify.com/track/3CeQIGPjCiPnLihxnIrS6c?si=01c9350bc474476b');
    INSERT INTO song (id, title, artist, spotify) --7
        VALUES (7, 'Believe', 'Josh Groban', 'https://open.spotify.com/track/2vJAjPkVMPKkR3xd2wacZa?si=5f323f99e4714af7');
    INSERT INTO song (id, title, artist, spotify) --8
        VALUES (8, 'A Holly Jolly Christmas', 'Burl Ives', 'https://open.spotify.com/track/77khP2fIVhSW23NwxrRluh?si=0d6e3e6c262c42ed');
    INSERT INTO song (id, title, artist, spotify) --9
        VALUES (9, 'Rockin'' Around The Christmas Tree', 'Brenda Lee', 'https://open.spotify.com/track/2EjXfH91m7f8HiJN1yQg97?si=66e3485ece314a92');
    INSERT INTO song (id, title, artist, spotify) --10
        VALUES (10, 'Merry Christmas Baby', 'Otis Redding', 'https://open.spotify.com/track/2dbfjsBbi3nt0a173iUumA?si=cc2576528c2b469c');
    INSERT INTO song (id, title, artist, spotify) --11
        VALUES (11, 'Blue Christmas', 'Elvis Presley', 'https://open.spotify.com/track/3QiAAp20rPC3dcAtKtMaqQ?si=6d53db15da354b85');
    INSERT INTO song (id, title, artist, spotify) --12
        VALUES (12, 'Like It''s Christmas', 'Jonas Brothers', 'https://open.spotify.com/track/1OjmlSFuzYflWjSMTCyTJv?si=967ed610768e4989');
    INSERT INTO song (id, title, artist, spotify) --13
        VALUES (13, 'Snoopy''s Christmas', 'The Royal Guardsmen', 'https://open.spotify.com/track/5UFjc1THXKIRYcMWihvNm0?si=66e11921a83440b8');
    INSERT INTO song (id, title, artist, spotify) --14
        VALUES (14, 'Rudolph the Red-Nosed Reindeer', 'Gene Autry', 'https://open.spotify.com/track/1dtIaSlyrLI04sqYa8nLyN?si=08123f8d013245bc');
    INSERT INTO song (id, title, artist, spotify) --15
        VALUES (15, 'Deck the Halls', 'Nat King Cole', 'https://open.spotify.com/track/0rHToGels2lt8Y0mCYoF90?si=8d283e95ffd14bb8');
    INSERT INTO song (id, title, artist, spotify) --16
        VALUES (16, 'Hallelujah', 'Pentatonix', 'https://open.spotify.com/track/0HZk0QsXPhMNAWNDR3rYE8?si=9dab19239ed74954');
    INSERT INTO song (id, title, artist, spotify) --17
        VALUES (17, 'Christmas All Over Again', 'Tom Petty and the Heartbreakers', 'https://open.spotify.com/track/30SNjazZhzunhAWCjhdyyD?si=6c9e0aca73384688');
    INSERT INTO song (id, title, artist, spotify) --18
        VALUES (18, 'It''s Beginning to Look a Lot like Christmas', 'Michael Bublé', 'https://open.spotify.com/track/5a1iz510sv2W9Dt1MvFd5R?si=4c9c3d13737b4386');
    INSERT INTO song (id, title, artist, spotify) --19
        VALUES (19, 'The 12 Days of Christmas', 'Straight No Chaser', 'https://open.spotify.com/track/5f5wlkRHWhYxOdp1hOUsTb?si=5f089969f73f4ee7');
    INSERT INTO song (id, title, artist, spotify) --20
        VALUES (20, 'Peace On Earth / Little Drummer Boy', 'Bing Crosby, David Bowie', 'https://open.spotify.com/track/10pmjIlKCeEhXy7OLZ6EGS?si=6fd7fc08d3534a09');
    INSERT INTO song (id, title, artist, spotify) --21
        VALUES (21, 'Run Rudolph Run', 'Chuck Berry', 'https://open.spotify.com/track/2pnPe4pJtq7689i5ydzvJJ?si=b449ebc3c645454e');
    INSERT INTO song (id, title, artist, spotify) --22
        VALUES (22, 'Winter Wonderland', 'Ella Fitzgerald', 'https://open.spotify.com/track/0z8aYfRIIvNibAccZRYu8x?si=2301bb4697aa4a53');
    INSERT INTO song (id, title, artist, spotify) --23
        VALUES (23, 'Wonderful Christmastime', 'Paul McCartney', 'https://open.spotify.com/track/1SV1fxF65n9NhRHp3KlBuu?si=81efc5dbfe714e20');
    INSERT INTO song (id, title, artist, spotify) --24
        VALUES (24, 'Linus and Lucy', 'Vince Guaraldi Trio', 'https://open.spotify.com/track/0MmNrhvLcoWjo7AOr0vgka?si=c7d0e92029064838');
    INSERT INTO song (id, title, artist, spotify) --25
        VALUES (25, 'Christmas Time Is Here', 'Vince Guaraldi Trio', 'https://open.spotify.com/track/299lFlaAsNQdgbIZNPmIA0?si=24839b4bc17d4c2c');
    INSERT INTO song (id, title, artist, spotify) --26
        VALUES (26, 'Do You Hear What I Hear?', 'Whitney Houston', 'https://open.spotify.com/track/5umJVEAPT2SocCoB99ZoaH?si=37609f9db59644cb');
    INSERT INTO song (id, title, artist, spotify) --27
        VALUES (27, 'Baby It''s Cold Outside', 'Idina Menzel, Michael Bublé', 'https://open.spotify.com/track/0Ie5uiv54KgCr7P4sYDTHl?si=c999415dca9b46d8');
    INSERT INTO song (id, title, artist, spotify) --28
        VALUES (28, 'Jingle Bell Rock - Daryl''s Version', 'Daryl Hall & John Oates', 'https://open.spotify.com/track/6pVW5LRWgeLaHudxauOTJU?si=f6a926d551fe4b21');
    INSERT INTO song (id, title, artist, spotify) --29
        VALUES (29, 'Christmas (Baby Please Come Home)', 'Darlene Love', 'https://open.spotify.com/track/46pF1zFimM582ss1PrMy68?si=1f6514eff5754728');
    INSERT INTO song (id, title, artist, spotify) --30
        VALUES (30, 'Merry Christmas, Happy Holidays', '*NSYNC', 'https://open.spotify.com/track/4v9WbaxW8HdjqfUiWYWsII?si=ee56f75bff5e4a45');
    INSERT INTO song (id, title, artist, spotify) --31
        VALUES (31, 'Christmas Every Day', 'David Archuleta', 'https://open.spotify.com/track/6yOzaZiBk4k4jSOYZcp4pm?si=a88ed855f88e46cb');
    INSERT INTO song (id, title, artist, spotify) --32
        VALUES (32, 'Little Drummer Boy', 'Pentatonix', 'https://open.spotify.com/track/7BvCDrlYwJ5D9RUqvvs3BT?si=702181506efb43bf');
    INSERT INTO song (id, title, artist, spotify) --33
        VALUES (33, 'All I Want for Christmas Is You', 'Mariah Carey', 'https://open.spotify.com/track/0bYg9bo50gSsH3LtXe2SQn?si=ff310a2bdc6241f8');
    INSERT INTO song (id, title, artist, spotify) --34
        VALUES (34, 'Feliz Navidad', 'The Last Bandoleros', 'https://open.spotify.com/track/02l2uupT1Hf2gRntikMh1k?si=d7140863e7b144d0');
    INSERT INTO song (id, title, artist, spotify) --35
        VALUES (35, 'Little Saint Nick', 'The Beach Boys', 'https://open.spotify.com/track/75dfH68JDisE8dDaD4KlVY?si=7b18989fe2dc425a');
    INSERT INTO song (id, title, artist, spotify) --36
        VALUES (36, 'First Christmas (That I Loved You)', 'Shameik Moore', 'https://open.spotify.com/track/5GEVVAnsDePwDMHKDunpda?si=2e2e2ad2191f406a');
    INSERT INTO song (id, title, artist, spotify) --37
        VALUES (37, 'White Christmas', 'Bing Crosby', 'https://open.spotify.com/track/3XsaSIPWvM61RIFfeb0BBR?si=90311fa05ba948a9');
    INSERT INTO song (id, title, artist, spotify) --38
        VALUES (38, 'Have Yourself A Merry Little Christmas', 'Sam Smith', 'https://open.spotify.com/track/1Qi2wh8fFgDV7tl4Sj3f2K?si=6e80196e58054beb');
    INSERT INTO song (id, title, artist, spotify) --39
        VALUES (39, 'Mistletoe', 'Justin Bieber', 'https://open.spotify.com/track/7xapw9Oy21WpfEcib2ErSA?si=1605ba00bc6044f6');
    INSERT INTO song (id, title, artist, spotify) --40
        VALUES (40, 'Christmas Wrapping', 'The Waitresses', 'https://open.spotify.com/track/3nhzTOc939C4v4ecTEZTPl?si=2d872b8fb21f4691');
    INSERT INTO song (id, title, artist, spotify) --41
        VALUES (41, 'It''s the Most Wonderful Time of the Year', 'Andy Williams', 'https://open.spotify.com/track/5hslUAKq9I9CG2bAulFkHN?si=b36fcf4727114c55');
    INSERT INTO song (id, title, artist, spotify) --42
        VALUES (42, 'You''re a Mean One, Mr. Grinch', 'Thurl Ravenscroft', 'https://open.spotify.com/track/6ZgigeSB0XUMqc0jjzaq6d?si=9e84abe81fc54145');
    INSERT INTO song (id, title, artist, spotify) --43
        VALUES (43, 'Winter Wonderland', 'Leona Lewis', 'https://open.spotify.com/track/1YBItUnKj01KBXhpFtvINp?si=e50c797966824aec');
    INSERT INTO song (id, title, artist, spotify) --44
        VALUES (44, 'Santy Baby', 'Eartha Kitt', 'https://open.spotify.com/track/1foCxQtxBweJtZmdxhEHVO?si=ad425c8494bd40c9');
    INSERT INTO song (id, title, artist, spotify) --45
        VALUES (45, 'Mary, Did You Know?', 'Pentatonix', 'https://open.spotify.com/track/4z8sz6E4YyFuEkv5o7IJni?si=a2ea0efe6bdc4c25');
    INSERT INTO song (id, title, artist, spotify) --46
        VALUES (46, 'Happy Holiday / The Holiday Season', 'Andy Williams', 'https://open.spotify.com/track/3sDdyBHQ60Cs1opmIyRvhp?si=32fd32c250624173');
    INSERT INTO song (id, title, artist, spotify) --47
        VALUES (47, 'Underneath the Tree', 'Kelly Clarkson', 'https://open.spotify.com/track/3YZE5qDV7u1ZD1gZc47ZeR?si=67c9b2d05316459f');
    INSERT INTO song (id, title, artist, spotify) --48
        VALUES (48, 'Baby, Its Cold Outside', 'Ludwig Ahgren, QTCinderella', 'https://open.spotify.com/track/6hQ0Cg9t7036jdy5wn0gmm?si=bffd647efad946f8');
    INSERT INTO song (id, title, artist, spotify) --49
        VALUES (49, 'Christmas Eve', 'Kelly Clarkson', 'https://open.spotify.com/track/3JKvHtrY7PXO7afJ9m6IG0?si=630863008939416f');
    INSERT INTO song (id, title, artist, spotify) --50
        VALUES (50, 'Last Christmas', 'Wham!', 'https://open.spotify.com/track/2FRnf9qhLbvw8fu4IBXx78?si=af5b001ecc794018');
    INSERT INTO song (id, title, artist, spotify) --51
        VALUES (51, 'Step Into Christmas', 'Elton John', 'https://open.spotify.com/track/6sBWmE23q6xQHlnEZ8jYPT?si=0daedabe0bcd4098');
    INSERT INTO song (id, title, artist, spotify) --52
        VALUES (52, 'Santa Claus Is Comin'' to Town', 'Bruce Springsteen', 'https://open.spotify.com/track/6s2wpWPFPAgKg2LXxi1Oee?si=b872be69af1f4380');
    INSERT INTO song (id, title, artist, spotify) --53
        VALUES (53, 'Jingle Bells', 'Frank Sinatra', 'https://open.spotify.com/track/4KV9bM7a1KDc7b7OakFZic?si=ff145a06dade4129');
    INSERT INTO song (id, title, artist, spotify) --54
        VALUES (54, 'Silver Bells', 'Dean Martin', 'https://open.spotify.com/track/4QX5pZQpQTgVlkqfUTDim0?si=18f1b15855d54874');
    INSERT INTO song (id, title, artist, spotify) --55
        VALUES (55, 'Feliz Navidad', 'José Feliciano', 'https://open.spotify.com/track/0oPdaY4dXtc3ZsaG17V972?si=987afec17cb741e1');
    INSERT INTO song (id, title, artist, spotify) --56
        VALUES (56, 'Winter Wonderland / Don''t Worry Be Happy', 'Pentatonix, Tori Kelly', 'https://open.spotify.com/track/2kPpxNSgXRvu5yqkRLKJIu?si=09c83bc905054cc2');
    INSERT INTO song (id, title, artist, spotify) --57
        VALUES (57, 'Sleigh Ride', 'The Ronettes', 'https://open.spotify.com/track/5ASM6Qjiav2xPe7gRkQMsQ?si=b6e72dc9c53a4dba');
    INSERT INTO song (id, title, artist, spotify) --58
        VALUES (58, 'Frosty the Snowman', 'The Ronettes', 'https://open.spotify.com/track/7n5m8nDAnyXo81tr4B3Bcw?si=68675ed209124360');
    INSERT INTO song (id, title, artist, spotify) --59
        VALUES (59, 'What Christmas Means to Me', 'CeeLo Green', 'https://open.spotify.com/track/2oTH6X8DjSwmTBoAolDou2?si=0ef6d72eae314bb5');
    INSERT INTO song (id, title, artist, spotify) --60
        VALUES (60, 'Up On The Housetop', 'Pentatonix', 'https://open.spotify.com/track/6k0XA5TEtAaWccA3NniAlh?si=3099021adbd14f1a');
    INSERT INTO song (id, title, artist, spotify) --61
        VALUES (61, 'That''s Christmas to Me', 'Pentatonix', 'https://open.spotify.com/track/2U9kDk5mlHYunC7PvbZ8KX?si=87a446d521544564');
    INSERT INTO song (id, title, artist, spotify) --62
        VALUES (62, 'A Mad Russian''s Christmas', 'Trans-Siberian Orchestra', 'https://open.spotify.com/track/4yrvnhXDys0DTs2yTqpLBJ?si=c5d57fba5733418d');
    INSERT INTO song (id, title, artist, spotify) --63
        VALUES (63, 'I Want a Hippopotamus for Christmas', 'Gayla Peevey', 'https://open.spotify.com/track/5P8Xvy5tzhmfyfA6GplQ8h?si=0adf011c1ab241f0');
    INSERT INTO song (id, title, artist, spotify) --64
        VALUES (64, 'Merry Christmas Everyone', 'Shakin'' Stevens', 'https://open.spotify.com/track/2TE4xW3ImvpltVU0cPcKUn?si=a8ade4af55b1438a');

    -- Tournament levels
    INSERT INTO tournament_level (id, tournament_id, name) --1
        VALUES (1, 1, 'Round 1');
    INSERT INTO tournament_level (id, tournament_id, name) --2
        VALUES (2, 1, 'Round 2');
    INSERT INTO tournament_level (id, tournament_id, name) --3
        VALUES (3, 1, 'Sweet Sixteen');
    INSERT INTO tournament_level (id, tournament_id, name) --4
        VALUES (4, 1, 'Elite Eight');
    INSERT INTO tournament_level (id, tournament_id, name) --5
        VALUES (5, 1, 'Semifinals');
    INSERT INTO tournament_level (id, tournament_id, name) --6
        VALUES (6, 1, 'Holly Jolly Bowl');
    
    -- Tournament rounds
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --1
        VALUES (1, 1, '2021-11-12 00:00', '2021-11-16 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --2
        VALUES (2, 1, '2021-11-16 00:00', '2021-11-20 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --3
        VALUES (3, 1, '2021-11-20 00:00', '2021-11-24 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --4
        VALUES (4, 1, '2021-11-24 00:00', '2021-11-28 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --5
        VALUES (5, 2, '2021-12-01 00:00', '2021-12-08 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --6
        VALUES (6, 2, '2021-12-10 00:00', '2021-12-17 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --7
        VALUES (7, 3, '2021-12-17 00:00', '2021-12-20 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --8
        VALUES (8, 4, '2021-12-20 00:00', '2021-12-23 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --9
        VALUES (9, 5, '2021-12-23 00:00', '2021-12-24 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --10
        VALUES (10, 6, '2021-12-24 00:00', '2021-12-25 00:00');
    
    -- Tournament matches
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (1, 1, 2, 1);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (1, 3, 4, 3);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (1, 5, 6, 6);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (1, 7, 8, 8);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (1, 9, 10, 9);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (1, 11, 12, 11);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (1, 13, 14, 14);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (1, 15, 16, 16);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (2, 17, 18, 17);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (2, 19, 20, 19);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (2, 21, 22, 21);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (2, 23, 24, 23);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (2, 25, 26, 26);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (2, 27, 28, 27);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (2, 29, 30, 29);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (2, 31, 32, 32);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (3, 33, 34, 33);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (3, 35, 36, 35);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (3, 37, 38, 37);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (3, 39, 40, 40);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (3, 41, 42, 41);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (3, 43, 44, 43);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (3, 45, 46, 45);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (3, 47, 48, 48);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (4, 49, 50, 50);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (4, 51, 52, 51);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (4, 53, 54, 54);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (4, 55, 56, 55);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (4, 57, 58, 57);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (4, 59, 60, 59);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (4, 61, 62, 61);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (4, 63, 64, 64);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (5, 1, 3, 3);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (5, 6, 8, 6);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (5, 9, 11, 9);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (5, 14, 16, 16);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (5, 17, 19, 17);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (5, 21, 23, 21);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (5, 26, 27, 27);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (5, 29, 32, 29);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (6, 33, 35, 35);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (6, 37, 40, 37);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (6, 41, 43, 41);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (6, 45, 48, 45);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (6, 50, 51, 50);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (6, 54, 55, 55);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (6, 57, 59, 57);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (6, 61, 64, 61);
    
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (7, 3, 6, 3);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (7, 9, 16, 9);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (7, 17, 21, 17);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (7, 27, 29, 29);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (7, 35, 37, 35);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (7, 41, 45, 41);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (7, 50, 55, 50);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (7, 57, 61, 57);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (8, 3, 9, 3);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (8, 17, 29, 17);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (8, 35, 41, 35);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (8, 50, 57, 50);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (9, 3, 17, 3);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (9, 35, 50, 35);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (10, 3, 35, 3);

END IF;

END $$;