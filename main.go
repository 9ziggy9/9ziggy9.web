package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"strings"
)

type LogLevel int
const (
	INFO = iota
	SUCCESS
	WARNING
	ERROR
)

var LogLevelStrMap = map[LogLevel]string{
	INFO:    "INFO",
	SUCCESS: "SUCCESS",
	WARNING: "WARNING",
	ERROR:   "ERROR",
}

func extractRuntimeMetaData() (string, string, int) {
	pc, file, line, ok := runtime.Caller(1)
	if !ok { panic("FATAL RUNTIME EXTRACTION ERROR") }
	fn := runtime.FuncForPC(pc).Name()
	return fn, file, line
}

const log_fmt_info string = "[%s] -> %s\n";
const log_fmt_err  string = "[%s] -> %s (@ %s :: %d)\n";
func ServerLog(lvl LogLevel, msg string, optargs ...interface{}) {
	switch (lvl) {
	case INFO:
		log.Printf(log_fmt_info, LogLevelStrMap[lvl], fmt.Sprintf(msg, optargs...));
	case ERROR:
		fn, _, line := extractRuntimeMetaData()
		log.Fatalf(
			log_fmt_err, LogLevelStrMap[lvl], fmt.Sprintf(msg, optargs...), fn, line,
		)
	}
}

func LoadEnv(filename string) error {
	ServerLog(INFO, "Loading environment variables from %s ...", filename)
	ServerLog(INFO, "Environmental variables loaded.")

	file, err := os.Open(filename); if err != nil { return err }
	defer file.Close()

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()
		if len(line) == 0 || strings.HasPrefix(line, "#") { continue } // comments

		kvp := strings.SplitN(line, "=", 2)
		if len(kvp) != 2 { continue }

		k := strings.TrimSpace(kvp[0])
		v := strings.TrimSpace(kvp[1])
		os.Setenv(k, v)
	}
	return scanner.Err()
}


const ENV_FILE string = "./.env";

func init() {
	if err := LoadEnv(ENV_FILE); err != nil {
		ServerLog(ERROR, "failed to load environment variables:\n%v", err)
	}
}

func main() {
	server := &http.Server{
		Addr: os.Getenv("PORT"),
		Handler: nil,
	}

	ServerLog(INFO, "Initializing server on port %s ... ", server.Addr)

	go func() {
		if err := server.ListenAndServe(); err != nil {
			ServerLog(ERROR, "failed to initialize server:\n%v", err)
		}
	}()

}
