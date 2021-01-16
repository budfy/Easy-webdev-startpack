declare module "vinyl-ftp" {
    import * as vinyl from 'vinyl';

    namespace VinylFtp {

        interface FtpConfiguration {
            /**
             * FTP host
             * @default localhost
             */
            host?: string,

            /**
             * FTP user
             * @default anonymous
             */
            user?: string,

            /**
             * FTP password
             * @default anonymous@
             */
            password?: string,

            /**
             * FTP port
             * @default 21
             */
            port?: number,

            /**
             * Log function
             * @default null
             */
            log?: (message?: any, ...optionalParams: any[]) => void,

            /**
             * Offset server time by this number of minutes
             * @default 0
             */
            timeOffset?: number,
            /**
             * Number of parallel transfers
             * @default 3
             */
            parallel?: number,

            /**
             * Maximum number of connections, should be greater or equal to "parallel". Default is 5, or the parallel setting. 
             * Don't worry about setting this too high, vinyl-ftp recovers from "Too many connections" errors nicely.
             * @default 5
             */
            maxConnections?: number

            /**
             * Clear caches before (each) stream
             * @default false
             */
            reload?: boolean,

            /**
             * Time to keep idle FTP connections (milliseconds)
             * @default 100
             */
            idleTimeout?: number,

            /**
             * A debug callback that gets extensive debug information
             * @default null
             */
            debug?: (...params: any[]) => void,

            /**
             * Set true for secured FTP connections
             * @default false
             */
            secure?: boolean,

            /**
             * Security Options
             */
            secureOptions?: SecureOptions
        }

        interface SecureOptions {
            /**
             * Set false for self-signed or expired secure FTP connections 
             */
            rejectUnauthorized: boolean
        }

        interface FtpOptions {
            /**
             * Set as file.cwd.
             * @default /
             */
            cwd?: string,

            /**
             * Set as file.base, default is glob beginning.
             * This is used to determine the file names when saving in .dest().
             */
            base?: string,

            /**
             * Only emit files modified after this date.
             */
            since?: Date,

            /**
             * Should the file be buffered (complete download) before emitting.
             * @default true
             */
            buffer?: boolean

            /**
             * Should the file be read. False will emit null files.
             * @default true
             */
            read?: boolean
        }

        interface FtpFile extends vinyl {
            ftp: {
                name: string,
                size: number,
                date: Date,
                type: string
            }
        }

        /**
         * A function to filter remote and local files.
         * Decide wether localFile should be emitted and invoke callback with boolean.
         * @param localFile The local file.
         * @param remoteFile The remote file.
         * @param callback The callback function.
         */
        type FilterFunction = ( localFile: vinyl, remoteFile: FtpFile, callback : FilterFunctionCallback) => void;

        /**
         * Callback function for the FilterFunction.
         * @param error Set to null if there is no error.
         * @param emit Set to true if the local file should be emitted.
         */
        type FilterFunctionCallback = (error: any, emit: boolean) => void;

        /**
         * Callback function for the delete operations.
         * @param error Set to null if there is no error.
         */
        type DeleteCallback = (error: any) => void;

        class FtpConnection {
            constructor(config?: FtpConfiguration);

            static create(config?: FtpConfiguration): FtpConnection;

            /**
             * Returns a vinyl file stream that emits remote files matched by the given globs. The remote files have a file.ftp property containing remote information.
             * @param globs Takes a glob string or an array of glob strings as the first argument.
             * Globs are executed in order, so negations should follow positive globs.
             * fs.src(['!b*.js', '*.js']) would not exclude any files, but this would: fs.src(['*.js', '!b*.js']).
             * @param options Vinyl FTP source options, changes the way the files are read, found, or stored in the vinyl stream.
             */
            src(globs: string | string[], options?: FtpOptions): NodeJS.ReadWriteStream;

            /**
             * Returns a transform stream that transfers input files to a remote folder. All directories are created automatically. Passes input files through.
             * @param remoteFolder The remote folder to deploy to.
             * @param options Vinyl FTP source options, changes the way the files are read, found, or stored in the vinyl stream.
             */
            dest(remoteFolder: string, options?: FtpOptions): NodeJS.ReadWriteStream;

            /**
             * Returns a transform stream that sets remote file permissions for each file.
             * @param remoteFolder The remote folder to deploy to.
             * @param mode Permission, must be between '0000' and '0777'.
             * @param options Vinyl FTP source options, changes the way the files are read, found, or stored in the vinyl stream.
             */
            mode(remoteFolder: string, mode: string, options?: FtpOptions): NodeJS.ReadWriteStream;

            /**
             * Returns a transform stream which filters the input for files which are newer than their remote counterpart.
             * @param remoteFolder The remote folder to deploy to.
             * @param options Vinyl FTP source options, changes the way the files are read, found, or stored in the vinyl stream.
             */
            newer(remoteFolder: string, options?: FtpOptions): NodeJS.ReadWriteStream;

            /**
             * Returns a transform stream which filters the input for files which have a different file size than their remote counterpart.
             * @param remoteFolder The remote folder to deploy to.
             * @param options Vinyl FTP source options, changes the way the files are read, found, or stored in the vinyl stream.
             */
            differentSize(remoteFolder: string, options?: FtpOptions): NodeJS.ReadWriteStream;

            /**
             * Returns a transform stream which filters the input for files which have a different file size or are newer than their remote counterpart.
             * @param remoteFolder The remote folder to deploy to.
             * @param options Vinyl FTP source options, changes the way the files are read, found, or stored in the vinyl stream.
             */
            newerOrDifferentSize(remoteFolder: string, options?: FtpOptions): NodeJS.ReadWriteStream;

            /**
             * Returns a transform stream that filters the input using a callback.
             * @param remoteFolder The remote folder to deploy to.
             * @param filter Filter function.
             * @param options Vinyl FTP source options, changes the way the files are read, found, or stored in the vinyl stream.
             */
            filter(remoteFolder: string, filter: FilterFunction, options?: FtpOptions): NodeJS.ReadWriteStream;

            /**
             * Deletes a file.
             * @param path The path to the remote file.
             * @param cb Callback when the file has been deleted.
             */
            delete(path: string, cb: DeleteCallback): void;

            /**
             * Removes a directory, recursively.
             * @param path The path to the remote directory.
             * @param cb Callback when the file has been deleted.
             */
            rmdir(path: string, cb: DeleteCallback): void;

            /**
             * Globs remote files, tests if they are locally available at <local>/<remote.relative> and removes them if not.
             * @param globs Takes a glob string or an array of glob strings as the first argument.
             * Globs are executed in order, so negations should follow positive globs.
             * fs.src(['!b*.js', '*.js']) would not exclude any files, but this would: fs.src(['*.js', '!b*.js']).
             * @param local Local folder to compare against.
             * @param options Vinyl FTP source options, changes the way the files are read, found, or stored in the vinyl stream.
             */
            clean(globs: string | string[], local: string, options?: FtpOptions): NodeJS.ReadWriteStream;
        }
    }

    export = VinylFtp.FtpConnection;
}
