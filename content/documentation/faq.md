
## Problem statements


#### What general rules do inputs and outputs follow?

In general, and when the statement does not explicitly state it otherwise, all inputs and outputs follow these rules:

- They only contain common characters: digits, uppercase and lowercase letters, punctuation ... (specifically those with ASCII codes between 32 and 126, plus the newline). So, no accents, characters such as `ç`, `Δ`, `市`, tabs, and so on.

- The line break is Unix. Note that the newlines of Windows or Mac do not work.

- The format of the input can be loose in terms of white spaces and line
breaks. For instance, if the statement indicates that the entry is made up
of several cases, each with two integer numbers, do not assume that every
case is on a line, or that the integer numbers are separated with exactly
one space.

- A word is considered a non-empty sequence of characters without any space or line break.

- All lines end with a line break, including the last. Therefore, do not print any line break if the output should be empty. But do print one line break if the output should be an empty line.

- There are no spaces before a line break. In particular, there are no lines with only one or more spaces before the line break.


## Solutions


#### How can I solve the Hello World problem in C++?

Here is a complete solution:

```C++
#include <iostream>
using namespace std;

int main() {
    cout << "Hello world!" << endl;
}
```

Take care to include the trailing endline.


#### How can I solve the Hello World problem in Python3?

Here is a complete solution:

```Python3
print("Hello world!")
```


#### How can I solve the Hello World problem in Java?

Here is a complete solution:

```Java
class Main {
    public static void main(String args[]) throws Exception {
        System.out.println("Hello world!");
    }
}
```

Please note that your Java program must be contained in the `Main` class. You cannot change this name.


#### Could I get a solution for the Hello World problem in my favorite language?

Sure, please see the [documentation on your specific compiler](/documentation/compilers).


#### Should preconditions in the statements be checked by my solutions?

No. All test cases meet the preconditions of the statements.

For example, if the statement asks for a function `int factorial(int n);`
that computes the factorial of a natural number `n`, the code can safely
assume that the given `n` is non-negative.

Also, if the statement asks to compute the sum of the elements of a sequence
ending with zero, you can be sure that there is a zero element to end the sequence.


#### Is zero a natural?

All problem statements in Jutge.org consider that zero is a natural number.


#### How should I write the C++ `main()` function?

Just write

```C++
int main() {
    // ...
}
```

Do not write

```C++
int main(int argc, char *argv[]) {
    // ...
}
```

nor

```C++
int main(int argc, char **argv) {
    // ...
}
```

Additionally, you can ommit the final `return 0;`.



#### When I program in C++, do I need to do something tricky for fast input?

No. Jutge.org always adds automatically these two lines at the beginning of your code:

```C++
ios_base::sync_with_stdio(false);
cin.tie(0);
```

Roughly speaking, these two lines make reading with `cin` as fast as with `scanf`.


#### I program in C++, and I mix `cin/cout` together with `scanf/printf`. Is this a problem in Jutge.org?

Yes. Because of the two lines mentioned above that are automatically added to your code,
you should never use `cin/cout` together with `scanf/printf`. Choose either `<iostream>` or `<cstdio>`.


#### When I program in C++, do I need to do something tricky for fast output?

No. In general, the judge's solutions never do that. Since your solution
can be twice as slow as the judge's solution, and get an AC verdict
anyway, you can just use `cout` to print the output, and `endl` as
endline. It is true that printing `'\n'` instead of `endl` can make your
program much faster when the output has many lines, but if you really need
to do this to avoid a TLE verdict, then the algorithm of your solution is
probably not good enough.


#### I program in C++, and I need to compute integer numbers much larger than 10^9 in absolute value. What can I do?

Use the `long long` type. You will be able to compute numbers up to more
than 10^18 in absolute value.


#### I program in C++, and I need to compute real numbers with a lot of precision. What can I do?

By default, use the `double` type. If you really need more precision, use
the `long double` type. Avoid the `float` type as much as possible.


#### I have two real numbers that should be equal, I compare them, but the program tells me that they are different. Why is this so?

You should be aware that all numbers inside a computer have a finite
number of decimal digits, so numerical errors are frequent. In particular,
if you have two real numbers `x` and `y` that are the result of several
operations, and you want to check if they are equal (mathematically
speaking), then  the plain comparision `x == y` is usually a bad idea,
because it is unlikely that both numbers are identical to the very last
digit. In practice, something like `abs(x - y) < 1e-8` should work fine.


#### I have written a solution that seems to work on my computer. However, when I submit it to the judge, I get a WA verdict. Why?

As a general rule, the problems in Jutge.org have many private test cases
that cover most mistakes that you can possibly make. There must be some
instances where your program fails, although you have not found any yet.


#### I am unable to find why my program gets a WA verdict when I send it to the judge. What can I do?

- Re-read the problem statement. Perhaps you have missed something.

- Try your program with all particular cases that you can imagine.
For instance, if you have to sort a sequence of numbers, try an empty sequence,
a sequence with just one element, a sequence already sorted, a sequence sorted in reverse order, a sequence where all alement are equal, a sequence with many elements, etc.

- Try also what happens with large numbers. Use `long long` if you need large integer numbers,
and `long double` if you need real numbers with a lot of precision. Watch out for overflows.

- Make sure that the outputs of your program for the sample inputs are
indeed as expected. It is surprising how many programs sent to Jutge.org
do not even pass the sample tests.

- Many problemes would be easy to solve by brute-force methods, except
that those solutions would be too slow for the judge. In those cases, you
can locally implement a slow solution, generate many random tests
(preferably small), execute both solutions (the fast but wrong and the
slow but safe) and compare the outputs. Hopefully, you will be able to
locate some tests where they differ, which could give you insight into the
mistake(s) of your wrong code.


#### The judge tells me that my program produces a wrong result with the public samples. However, when I test my program locally with the sample input, it prints the sample output. How is this possible?

There are two typical reasons:

- The output produced by your solution looks like the expected output, but
in fact they are different. To avoid this simple mistake, you can store
the output of your program for the sample and for the corresponding expected
output into two different files, say `sample.out` and `sample.cor`, and
compare them with a command like `diff sample.out sample.cor` (under Linux).

- If the output of your program is really different when executed in Jutge.org
than when executed in your own computer,
this usually happens when your program has some variable not properly initialized,
which makes the code work or not depending on the (more or less random) initial value
stored in the variable.
Also, for similar reasons,
check that all your functions return something in all their branches.
Otherwise, your program can have an undefined behavior.
If you program in C++, compiling your code with `g++ -Wall`
may detect and warn you about these issues.



#### I have written a solution that seems to work fast in my computer. However, when I submit it to the judge, I get a TLE verdict. Why?

For most problems, the input is not one case but many cases.
Therefore, even if the running time of your program is "almost zero" for one case,
for thousands of cases, some of them really big, the total running time can be too large.
By "too large", we roughly mean more than twice the total time of the official solution for the problem.
Try to find an algorithm with better complexity,
or perhaps it will be enough if you implement your algorithm more accurately,
to avoid unnecessary overheads.


#### I have written a solution that gets a WA verdict by the judge. Does this mean that my solution is fast enough? That is, if there is just one bug and I manage to find it and correct it, will I get an AC verdict, or may I get a TLE?

Most probably, you will get an AC. Jutge.org tests the programs
against all the private tests cases for the problem under consideration,
computes the verdict for every test, and reports the worst of the
verdicts. Therefore, if you get a WA, then there was no private test case
for which your program was too slow.


#### For some reason, I have sent the same solution for the same problem more than once, and I have got two different verdicts. How is this possible?

This situation is unlikely, but possible. For instance, suppose that your
program is correct but about twice as slow as the official solution. Note
that the time to execute the same program on the same test case can vary
slightly depending on several reasons. So, an execution can spend a bit
more than the allowed time (TLE), and another execution can spend a bit
less (AC).

As another example, some programs may use randomness to solve a problem
probabilistically. Therefore, depending on "the luck" (for instance, the
initial seed), the same program can compute the right answers (AC) or not
(WA).


## Verdicts

#### Could I get information about a verdict?

Sure, please see the [documentation on verdicts](/documentation/verdicts).


## Logos

#### Can I get high resolution version of the Jutge.org logos?

Yes, these are provided in vectorial format using the SVG format:

- [Judge](https://jutge.org/svg/jutge.svg)
- [Green light](https://jutge.org/svg/semafor.svg)


