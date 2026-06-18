## Code metrics

Code metrics provide measures extracted from a static inspection of the submitted code. Currently, Jutge.org provides the following metrics (for the whole submission and for each of its functions if possible):

- **Cyclomatic complexity (ccn):** McCabe's Cyclomatic complexity indicates the complexity of a program measuring the number of linearly independent paths through a program's source code. It is considered that cyclomatic complexities up to 9 are all right, up to 14 are difficult, and above 14 are too much complicated.

- **Halstead's difficulty (dif):** Halstead complexity measures vocabulary, program length, volume, difficulty, and effort by a static inspection of the code. In particular, difficulty relates to the difficulty of understanding the program when reading or writing it.

- **Maintainability index (mnt):** The maintainability index is a composite metric calculated from cyclomatic complexity, Halstead volume, and lines of code. It estimates how easy a codebase is to maintain, with higher values indicating better maintainability.

- **Lines of code (loc):** The number of lines of code measures the size of a program by counting the number of lines in the text of the program's source code. Quite crude!

- **Documentation index (com):** The ratio of comment lines to total lines of code, giving an indication of how well the code is documented. Quite crude!

Treat these values as heuristics and as rough estimates.

Jutge.org also provides a comparison between your code metrics and those of the official solution. The ratio between both can be quite revealing: if your metrics are consistently much higher than the solution's, it is worth stopping to reflect on what is happening — your code may be more complex, longer, harder to read, or harder to maintain than it can be.

Read more information and criticism on [software metrics](https://en.wikipedia.org/wiki/Software_metric).

Jutge.org uses the [multimetric](https://github.com/jutge-org/multimetric) tool to compute the metrics.