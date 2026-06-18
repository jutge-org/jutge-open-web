import c from 'devicon/icons/c/c-original.svg?url'
import clojure from 'devicon/icons/clojure/clojure-original.svg?url'
import cmake from 'devicon/icons/cmake/cmake-original.svg?url'
import unkown from 'devicon/icons/codepen/codepen-original.svg?url'
import cpp from 'devicon/icons/cplusplus/cplusplus-original.svg?url'
import crystal from 'devicon/icons/crystal/crystal-original.svg?url'
import csharp from 'devicon/icons/csharp/csharp-original.svg?url'
import fortran from 'devicon/icons/fortran/fortran-original.svg?url'
import go from 'devicon/icons/go/go-original.svg?url'
import haskell from 'devicon/icons/haskell/haskell-original.svg?url'
import java from 'devicon/icons/java/java-original.svg?url'
import javascript from 'devicon/icons/javascript/javascript-original.svg?url'
import julia from 'devicon/icons/julia/julia-original.svg?url'
import kotlin from 'devicon/icons/kotlin/kotlin-original.svg?url'
import verilog from 'devicon/icons/labview/labview-original.svg?url'
import lua from 'devicon/icons/lua/lua-original.svg?url'
import nim from 'devicon/icons/nim/nim-original.svg?url'
import objectivec from 'devicon/icons/objectivec/objectivec-plain.svg?url'
import perl from 'devicon/icons/perl/perl-original.svg?url'
import php from 'devicon/icons/php/php-original.svg?url'
import prolog from 'devicon/icons/prolog/prolog-original.svg?url'
import python from 'devicon/icons/python/python-original.svg?url'
import r from 'devicon/icons/r/r-original.svg?url'
import ruby from 'devicon/icons/ruby/ruby-original.svg?url'
import rust from 'devicon/icons/rust/rust-original.svg?url'
import visualbasic from 'devicon/icons/visualbasic/visualbasic-original.svg?url'
import zig from 'devicon/icons/zig/zig-original.svg?url'
import readthedocs from 'devicon/icons/readthedocs/readthedocs-original.svg?url'
import { BrainIcon, ParenthesesIcon, SpaceIcon } from 'lucide-react'
import Image from 'next/image'

export type DevIconProps = {
    proglang: string
    size: number
}

export function DevIcon({ proglang, size = 14 }: DevIconProps) {
    switch (proglang) {
        case 'C++':
            return <Image src={cpp} alt="" width={size} height={size} />
        case 'C':
            return <Image src={c} alt="" width={size} height={size} />
        case 'Python':
            return <Image src={python} alt="" width={size} height={size} />
        case 'Java':
            return <Image src={java} alt="" width={size} height={size} />
        case 'Haskell':
            return <Image src={haskell} alt="" width={size} height={size} />
        case 'Make':
            return <Image src={cmake} alt="" width={size} height={size} />
        case 'Clojure':
            return <Image src={clojure} alt="" width={size} height={size} />
        case 'Rust':
            return <Image src={rust} alt="" width={size} height={size} />
        case 'Zig':
            return <Image src={zig} alt="" width={size} height={size} />
        case 'Ruby':
            return <Image src={ruby} alt="" width={size} height={size} />
        case 'R':
            return <Image src={r} alt="" width={size} height={size} />
        case 'PHP':
            return <Image src={php} alt="" width={size} height={size} />
        case 'Prolog':
            return <Image src={prolog} alt="" width={size} height={size} />
        case 'Crystal':
            return <Image src={crystal} alt="" width={size} height={size} />
        case 'BASIC':
            return <Image src={visualbasic} alt="" width={size} height={size} />
        case 'Fortran':
            return <Image src={fortran} alt="" width={size} height={size} />
        case 'Julia':
            return <Image src={julia} alt="" width={size} height={size} />
        case 'Kotlin':
            return <Image src={kotlin} alt="" width={size} height={size} />
        case 'Lua':
            return <Image src={lua} alt="" width={size} height={size} />
        case 'Nim':
            return <Image src={nim} alt="" width={size} height={size} />
        case 'JavaScript':
            return <Image src={javascript} alt="" width={size} height={size} />
        case 'Go':
            return <Image src={go} alt="" width={size} height={size} />
        case 'Perl':
            return <Image src={perl} alt="" width={size} height={size} />
        case 'C#':
            return <Image src={csharp} alt="" width={size} height={size} />
        case 'Verilog':
            return <Image src={verilog} alt="" width={size} height={size} />
        case 'Objective-C':
            return <Image src={objectivec} alt="" width={size} height={size} />
        case 'Quiz':
            return <Image src={readthedocs} alt="" width={size} height={size} />
        case 'Whitespace':
            return <SpaceIcon width={size} height={size} />
        case 'Lisp':
        case 'Scheme':
            return <ParenthesesIcon width={size} height={size} />
        case 'Brainfuck':
            return <BrainIcon width={size} height={size} />
        default:
            return <Image src={unkown} alt="" width={size} height={size} />
    }
}
