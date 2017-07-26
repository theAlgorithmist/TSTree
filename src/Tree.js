/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
/**
 * Typescript Math Toolkit: General Tree.  A tree has a root node and both the root and subsequent nodes may have an
 * arbitrary number of child nodes.  Most of the actual tree 'construction' is performed directly on Tree Nodes
 * (instances of TSMT$TreeNode<T>).  This class facilitates creating a root and provides a rich set of methods for
 * searching and traversing the tree.
 *
 * Insertion into a tree may be ordered or unordered, which sets the 'ordered' flag of any newly created node.  This
 * means that all subsequent child additions to that node are automatically positioned LTR in order of increasing
 * node value.  Ordering only applies to the direct children of a given node; there is no implied global ordering
 * imposed across the entire tree.  Ordering is set to true by default.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
var TreeNode_1 = require('./TreeNode');
var TSMT$Tree = (function () {
    /**
     * Construct a new TSMT$Tree<T>
     *
     * @return nothing A new tree is created of the specified type
     */
    function TSMT$Tree() {
        this._root = null;
        this._size = 0;
        this._ordered = true;
    }
    Object.defineProperty(TSMT$Tree.prototype, "size", {
        /**
         * Access the size or number of nodes in the TSMT$AVLTree
         *
         * @return number - Total number of nodes in the AVLTree
         */
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Tree.prototype, "root", {
        /**
        * Access the root node in the TSMT$AVLTree
        *
        * @return number - Total number of nodes in the AVLTree
        */
        get: function () {
            return this._root;
        },
        /**
         * Assign the root node with an already created tree node
         *
         * @param node: TSMT$TreeNode<T> Reference to already created node to serve as the tree root
         *
         * @returns nothing The tree root is assigned; this will override any prior root setting, so clear an already
         * constructed tree before resetting the root
         */
        set: function (node) {
            if (node !== undefined && node != null && node instanceof TreeNode_1.TSMT$TreeNode) {
                this._root = node;
                this._root.ordered = this._ordered;
                // tree size is now same as root node size
                this._size = node.size;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Tree.prototype, "ordered", {
        /**
         * Access whether or not direct tree children maintain ordered child insertion
         *
         * @returns boolean True if the tree is ordered, meaning that all direct children are inserted in order of increasing
         * node value
         */
        get: function () {
            return this._ordered;
        },
        /**
         * Assign whether or not direct tree children maintain ordered child insertion
         *
         * @param value: boolean True if the tree is ordered, meaning that all direct children are inserted in order of increasing
         * node value
         *
         * @returns nothing
         */
        set: function (value) {
            this._ordered = value === true ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Tree.prototype, "height", {
        /**
         * Access the height of a this tree
         *
         * @returns number Height of this tree; the height of a null or singleton root is zero
         */
        get: function () {
            if (this._root == null || !this._root.hasChildren) {
                return 0;
            }
            return this._root.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Tree.prototype, "levels", {
        /**
         * Access the number of levels of this tree
         *
         * @returns number A null root has zero levels.  A singleton (root) has one level.  A root with one level of children
         * has a total of two levels, and so on.
         */
        get: function () {
            if (this._root == null) {
                return 0;
            }
            return 1 + this.height;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create the root node from an id and node value
     *
     * @param id: string Root node id
     *
     * @returns nothing The tree root is assigned; this will override any prior root setting, so clear an already
     * constructed tree before resetting the root.  Returns null if data is invalid.
     */
    TSMT$Tree.prototype.setRoot = function (id, value) {
        if (id !== undefined && id != '' && value !== undefined) {
            var node = new TreeNode_1.TSMT$TreeNode(value);
            node.id = id;
            node.ordered = this._ordered;
            this._root = node;
            this._size++;
            return node;
        }
        return null;
    };
    /**
     * Clear the current tree
     *
     * @return nothing The tree is cleared (all node references are nulled, the tree root is nulled, and tree size set to zero)
     */
    TSMT$Tree.prototype.clear = function () {
        if (this._size > 0) {
            if (this._root != null) {
                this._root.clear();
                this._root = null;
            }
            this._size = 0;
            this._root = null;
        }
    };
    /**
     * Insert a node into the tree by id & value as a child of the specified parent
     *
     * @param id: string Node id
     *
     * @param value: T Node data
     *
     * @param parent: TSMT$TreeNode<T> Optional parent for the newly created node; if undefined and root node has
     * not been assigned, this will automatically create and assign the root node
     *
     * @return TSMT$TreeNode<T> Reference to the newly created node or null if inputs are invalid.  If the parent is
     * not provided and the root has already been assigned, this method will return null.
     */
    TSMT$Tree.prototype.insert = function (id, value, parent) {
        if (value != null && value != undefined && id !== undefined && id != '') {
            if (parent !== undefined && parent != null) {
                var node = new TreeNode_1.TSMT$TreeNode(value);
                node.id = id;
                node.ordered = this._ordered;
                parent.addChild(node);
                this._size++;
                return node;
            }
            else {
                if (this._root == null) {
                    this._root = new TreeNode_1.TSMT$TreeNode(value);
                    this._root.id = id;
                    this._root.ordered = this._ordered;
                    this._size++;
                    return this._root;
                }
            }
        }
        return null;
    };
    /**
     * Delete a node into the tree with the specified id
     *
     * @param id: string Node id
     *
     * @return TSMT$TreeNode<T> If node is found in the tree with the specified id, that node (and by extension, its subtree)
     * is deleted from the tree.  That node and all children are automatically cleared and prepared for garbage collection.
     * Returns null if no node is found with the specified id.
     */
    TSMT$Tree.prototype.delete = function (id) {
        if (id !== undefined && id != '') {
            var node = this.find(id);
            if (node != null) {
                // if the node has a parent, it must be deleted from that parent in order to fix the child list
                if (node.parent != null) {
                    node.parent.deleteChild(node);
                }
                // was the root deleted?
                if (id == this._root.id) {
                    this._root = null;
                    this._size = 0;
                }
                else {
                    // update the tree size
                    this._size = this._root.size;
                }
            }
        }
    };
    /**
     * Find an item with a specified id in a subtree
     *
     * @param id: string id
     *
     * @param root: TSMT$BTreeNode<T> optional root node for the search - defaults to tree root
     *
     * @return TSMT$BTreeNode<T> Node with the specified value or null if not found
     */
    TSMT$Tree.prototype.find = function (id, root) {
        if (root == null || root === undefined) {
            root = this._root;
        }
        if (root.id == id) {
            return root;
        }
        var list = root.head;
        var node;
        while (list.next != null) {
            node = list.node;
            if (node.id == id) {
                return node;
            }
            if (node.hasChildren) {
                node = this.find(id, node);
                if (node != null) {
                    return node;
                }
            }
            list = list.next;
        }
        if (root.tail.node.id == id) {
            return root.tail.node;
        }
        if (root.tail.node.hasChildren) {
            node = this.find(id, root.tail.node);
            if (node != null) {
                return node;
            }
        }
        return null;
    };
    /**
     * Perform a preorder traversal. starting at the input node and return the node path in an array
     *
     * @param node: TSMT$TreeNode<T> Optional reference to starting node, defaults to root if not supplied
     *
     * @return Array<TSMT$BreeNode<T>> Preorder path
     */
    TSMT$Tree.prototype.preorder = function (node) {
        // note: caching is not yet implemented
        if (node === undefined) {
            node = this._root;
        }
        this._path = new Array();
        this.__preorderTraversal(node);
        return this._path.slice();
    };
    /**
     * Recursively compute pre-order path
     *
     * @param node: TSMT$TreeNode<T> Reference to current node in traversal
     *
     * @returns nothing - sets internal path which may be later used for caching a search path
     *
     * @private
     */
    TSMT$Tree.prototype.__preorderTraversal = function (node) {
        if (node == null) {
            return;
        }
        this._path.push(node);
        var list = node.head;
        while (list.next != null) {
            this.__preorderTraversal(list.node);
            list = list.next;
        }
        if (node.tail.node) {
            this.__preorderTraversal(node.tail.node);
        }
    };
    /**
     * Perform a postorder traversal. starting at the input node and return the node path in an array
     *
     * @param node: TSMT$TreeNode<T> Optional reference to starting node, defaults to root if not supplied
     *
     * @return Array<TSMT$BreeNode<T>> Postorder path
     */
    TSMT$Tree.prototype.postorder = function (node) {
        // note: caching is not yet implemented
        if (node === undefined) {
            node = this._root;
        }
        this._path = new Array();
        this.__postorderTraversal(node);
        return this._path.slice();
    };
    /**
     * Recursively compute post-order path
     *
     * @param node: TSMT$TreeNode<T> Reference to current node in traversal
     *
     * @returns nothing - sets internal path which may be later used for caching a search path
     *
     * @private
     */
    TSMT$Tree.prototype.__postorderTraversal = function (node) {
        if (node == null) {
            return;
        }
        var list = node.head;
        while (list.next != null) {
            this.__postorderTraversal(list.node);
            list = list.next;
        }
        if (node.tail.node) {
            this.__postorderTraversal(node.tail.node);
        }
        this._path.push(node);
    };
    /**
     * Perform a breadth-first or level traversal, starting at the input node, and return the node path in an array
     *
     * @param node: TSMT$TreeNode<T> Optional reference to starting node - will default to tree root
     *
     * @return Array<TSMT$TreeNode<T>> breadth-first path
     */
    TSMT$Tree.prototype.levelOrder = function (node) {
        if (node == undefined) {
            node = this._root;
        }
        if (node == null) {
            return [];
        }
        this._path = new Array();
        var list = new Array();
        list.push(node);
        var n;
        while (list.length > 0) {
            n = list.shift();
            this._path.push(n);
            if (n.hasChildren) {
                var nodeList = n.head;
                while (nodeList.next != null) {
                    list.push(nodeList.node);
                    nodeList = nodeList.next;
                }
                // tail
                list.push(nodeList.node);
            }
        }
        return this._path.slice();
    };
    return TSMT$Tree;
}());
exports.TSMT$Tree = TSMT$Tree;
