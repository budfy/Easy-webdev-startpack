# Changelog

## v0.6.0

- Updated dependencies
- Improved test suite

## v0.5.0

- Fixed #3
- Fixed #54
- Added `clean`
- Updated dependencies

## v0.4.5

- Fixed #30 - connections errors are now properly emitted

## v0.4.4

- Improved connection pool
  - Connections stay alive for a configurable amount of time (`idleTimeout`)
  - Higher number of reused connections, slight performance gain
  - `keep` is now obsolete
  - Fixed #19 with test (concurrency problems)
- Improved tests

## v0.4.3

- Fixed MLSD always falling back to list

## v0.4.2

- Fixed MLSD bug(s)

## v0.4.0

- Improved tests some more
- Added `delete` and `rmdir`

## v0.3.4

- Added 450 code for LIST/No such file

## v0.3.3

- Fixed checking for directories on various servers
- Fixed LIST fallback

## v0.3.0

- Added `src`
- Restructured code and tests
- Removed `step` dependency
- Added changelog
