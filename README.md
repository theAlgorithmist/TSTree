# Typescript Math Toolkit General Tree


This is the alpha release of the Typescript Math Toolkit general tree library.  Each tree node may have an arbitrary number of children and no presumptions are made regarding the number of children per node.

The purpose of this release is to make an early version of the source code available to Typescript developers for testing and feedback on the current API.


Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 2.0.3

Version: 1.0


## Installation

Installation involves all the usual suspects

  - npm and gulp installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. gulp compile

2. gulp test

The test suite is in Mocha/Chai and specs reside in the _test_ folder.


### Contents

The library currently contains two classes, _TSMT$TreeNode<T>_ to model a tree node and _TSMT$Tree<T>_ to represent the entire tree.

The public API of the _TSMT$TreeNode<T>_ class is

```
get ordered(): boolean
get childCount(): number
get size(): number
get height(): number
get traverse(): boolean
get data(): any
get parent(): TSMT$TreeNode<T>
get head(): TSMT$ITreeList<T>
get tail(): TSMT$ITreeList<T>
get value(): number
get min(): number
get max(): number
get hasChildren(): boolean
get childIdList(): Array<string>
set data(value: any)
set ordered(value: boolean)
set parent(node: TSMT$TreeNode<T>)
addChild(node: TSMT$TreeNode<T>)
deleteChild(node: TSMT$TreeNode<T>): void
deleteChildByID(id: string): TSMT$TreeNode<T>
compare(node: TSMT$TreeNode<T>): number
compareTo(node: TSMT$TreeNode<T>): number
clear(): void
```

The public API of the _TSMT$Tree<T> class is

```
get size(): number
get root(): TSMT$TreeNode<T>
get ordered(): boolean
get height(): number
get levels(): number
set ordered(value: boolean)
set root(node: TSMT$TreeNode<T>)
setRoot(id: string, value: T): TSMT$TreeNode<T>
clear(): void
insert(id: string, value: T, parent?: TSMT$TreeNode<T>): TSMT$TreeNode<T>
delete(id: string): void
find(id: string, root?: TSMT$TreeNode<T>): TSMT$TreeNode<T>
preorder(node?: TSMT$TreeNode<T>): Array<TSMT$TreeNode<T>>
postorder(node?: TSMT$TreeNode<T>): Array<TSMT$TreeNode<T>>
levelOrder(node?: TSMT$TreeNode<T>): Array<TSMT$TreeNode<T>>
```

### Usage

A tree node has two critical properties, an _id_ (currently a _public string_) and a value.  The latter may be of arbitrary type, but it is important for node values to be comparable, so data types such as _string_, _number_, or an _Object_ with a _value_ property are most common.

A tree may be structured by manually creating individual nodes and assigning their child lists.  Then, add the root node to the tree.

If known in advance, values are best assigned during construction.

```
const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);

root.id   = "root";
child.id  = "c1";
child2.id = "c2";
child3.id = "c3";
child4.id = "c4";

root.addChild(child);
root.addChild(child2);

child.addChild(child3);
child.addChild(child4);

const tree: TSMT$Tree<number> = new TSMT$Tree<number>;
tree.root                     = root;
```

For some applications, it is possible to work productively by only using the _TSMT$TreeNode<T>_ class, although this requires advance knowledge of the tree hierarchy.

An empty tree may be created, after which nodes are created by inserting id and value information as a child of another node.

```
const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
tree.ordered = false;

const A: TSMT$TreeNode<number> = tree.insert('A', 1.0);

const B: TSMT$TreeNode<number> = tree.insert('B', 1.0, A);
const C: TSMT$TreeNode<number> = tree.insert('C', 1.0, A);
const D: TSMT$TreeNode<number> = tree.insert('D', 1.0, A);
const E: TSMT$TreeNode<number> = tree.insert('E', 1.0, A);

const F: TSMT$TreeNode<number> = tree.insert('F', 1.0, B);
const G: TSMT$TreeNode<number> = tree.insert('G', 1.0, B);
const H: TSMT$TreeNode<number> = tree.insert('H', 1.0, B);

const I: TSMT$TreeNode<number> = tree.insert('I', 1.0, C);

const J: TSMT$TreeNode<number> = tree.insert('J', 1.0, E);
const K: TSMT$TreeNode<number> = tree.insert('K', 1.0, E);
const L: TSMT$TreeNode<number> = tree.insert('L', 1.0, E);

const M: TSMT$TreeNode<number> = tree.insert('M', 1.0, G);
const N: TSMT$TreeNode<number> = tree.insert('N', 1.0, G);
const O: TSMT$TreeNode<number> = tree.insert('O', 1.0, G);

const P: TSMT$TreeNode<number> = tree.insert('P', 1.0, M);


const path: Array<TSMT$TreeNode<number>> = tree.preorder();
```

Again, this is an instance where the tree hierarchy was known in advance.  In many applications, it is necessary to search for a node with a particular id.  That node becomes a parent for one or more child insertions.  For this reason, it is the user's responsibility to ensure that all tree node id's are unique.

Refer to the specs in the _test_ folder for more usage examples.


### Notes

- Node children may be ordered, that is insertion into the child list is performed in order of increasing value, left-to-right.  A tree has ordered nodes by default, although this may be disabled, if desired.  Ordering extends **only** to the direct children of a node.

- Node children are internally represented as a doubly-linked list with _head_ and _tail_ accessors.  This allows ordered children to be traversed by ascending or descening value, depending on application requirements.

- Recall that inorder traversal is not uniquely defined for a general tree (unlike the binary AVL tree), so the _TSMT$Tree<T>_ class only contains preorder, postorder, and level-order (or BFS) traversals.

- All tree node ID's should be unique!  It's worth saying again :)

- Traversal results are currently cached in a class array, just like the AVL Tree.  That cache is not currently exploited if the same traveral is performed multiple times without changing the tree.  This will likely be a future addition before the full data structures library is released.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>

