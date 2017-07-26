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
var TSMT$TreeNode = (function () {
    /**
     * Construct a new TSMT$TreeNode
     *
     * @param d: T (optional) Node data of the appropriate type.
     *
     * @return Nothing Note that a direct reference to the data is stored internally
     */
    function TSMT$TreeNode(d) {
        if (d != undefined && d != null) {
            this._data = d;
        }
        this.id = "";
        this._children = 0;
        this._parent = null;
        this._head = { prev: null, next: null, node: null };
        this._tail = this._head;
        this._ordered = false;
        this._traverse = true;
        this._min = Number.MAX_VALUE;
        this._max = Number.MIN_VALUE;
    }
    Object.defineProperty(TSMT$TreeNode.prototype, "ordered", {
        /**
         * Access whether or not this node's children are ordered
         *
         * @returns boolean True if children of this node are ordered LTR by increasing node value
         */
        get: function () {
            return this._ordered;
        },
        /**
         * Assign whether or not node children are ordered
         *
         * @param value: boolean True if node children are to be ordered by value when added to this node's child list.  This
         * value MUST be assigned before adding any children, otherwise, ordering will only apply to insertions AFTER setting
         * this parameter.
         *
         * @returns nothing
         */
        set: function (value) {
            this._ordered = value === true ? true : false;
            if (this._ordered && this._children > 0) {
                // update bounds
                this.__getBounds();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "childCount", {
        /**
         * Access the number of children for this node
         *
         * @return number Number of direct children
         */
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "size", {
        /**
         * Access the total number of nodes for which this node is a root, inclusive
         *
         * @returns number Total number of nodes for which this node is a root, plus one
         */
        get: function () {
            if (this._children == 0) {
                return 1;
            }
            var size = 1 + this.__size(this);
            return size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "height", {
        /**
         * Access the height to total number of levels of this node.  A singleton node has a height of 0.
         */
        get: function () {
            if (this._children == 0) {
                return 0;
            }
            var h = 0;
            var list = this._head;
            while (list.next != null) {
                if (list.node && list.node.hasChildren) {
                    h = Math.max(h, this.__height(list.node));
                }
                list = list.next;
            }
            if (this._tail.node && this._tail.node.hasChildren) {
                h = Math.max(h, this.__height(this._tail.node));
            }
            return 1 + h;
        },
        enumerable: true,
        configurable: true
    });
    TSMT$TreeNode.prototype.__height = function (node) {
        var h = 0;
        if (node.hasChildren) {
            h++;
            var list = node.head;
            while (list.next != null) {
                if (list.node && list.node.hasChildren) {
                    h += this.__height(list.node);
                }
                list = list.next;
            }
            if (node.tail.node && node.tail.node.hasChildren) {
                h += this.__height(node.tail.node);
            }
        }
        return h;
    };
    /**
     * Recursive method to accumulate node size
     *
     * @param node TSMT$TreeNode<T> Input tree node
     *
     * @returns {number} Size of this node
     *
     * @private
     */
    TSMT$TreeNode.prototype.__size = function (node) {
        var list = node.head;
        var n;
        var size = 0;
        while (list.node && list.next != null) {
            n = list.node;
            size++;
            if (n.hasChildren) {
                size += this.__size(n);
            }
            list = list.next;
        }
        n = node.tail.node;
        size++;
        if (n.hasChildren) {
            size += this.__size(n);
        }
        return size;
    };
    Object.defineProperty(TSMT$TreeNode.prototype, "traverse", {
        /**
         * Access whether or not this node may be traversed
         *
         * @returns boolean true if the node and its children may be traversed, false if it has been pruned
         */
        get: function () {
            return this._traverse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "data", {
        /**
         * Access node data
         *
         * @return T A copy of the node's data (if the data is anything more complex than a simple Object, it
         * should implement a clone method)
         */
        get: function () {
            if (this._data == undefined) {
                return null;
            }
            if (typeof this._data == "number") {
                return this._data;
            }
            else if (typeof this._data == "string") {
                return (' ' + this._data).slice(1);
            }
            else if (typeof this._data == "object") {
                return JSON.parse(JSON.stringify(this._data));
            }
            else if (this._data['clone'] != undefined) {
                return this._data['clone']();
            }
            return null;
        },
        /**
         * Assign data to this node
         *
         * @param value: T node data
         *
         * @return nothing
         */
        set: function (value) {
            if (value == null || value == undefined) {
                return;
            }
            if (typeof value == "number") {
                this._data = value;
            }
            else if (typeof value == "string") {
                this._data = (' ' + value).slice(1);
            }
            else if (typeof value == "object") {
                this._data = JSON.parse(JSON.stringify(value));
            }
            else if (value['clone'] != undefined) {
                this._data = value['clone']();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "parent", {
        /**
         * Access a direct reference to this node's parent
         *
         * @return TSMT$TreeNode<T> Direct reference to this node's parent
         */
        get: function () {
            return this._parent;
        },
        /**
         * Assign this node's parent
         *
         * @param node: TSMT$TreeNode<T> Reference to this node's new parent
         *
         * @return nothing The new parent reference is set provided the input is valid; it is allowable to set the reference to null
         */
        set: function (node) {
            if ((node != undefined && node instanceof TSMT$TreeNode) || node == null) {
                this._parent = node;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "head", {
        /**
         * Access a direct reference to the head node in the child list
         *
         * @return TSMT$ITreeList<T> Direct reference to the head node in the child list
         */
        get: function () {
            return this._head;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "tail", {
        /**
         * Access a direct reference to the tail node in the child list
         *
         * @return TSMT$ITreeList<T> Direct reference to the tail node in the child list
         */
        get: function () {
            return this._tail;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "value", {
        /**
         * Return the numerical value of this node
         *
         * @return number A numerical measure of this node's value.  The current implementation is suitable for numeric data;
         * this method is usually overridden for other types of nodes where the value may be derived from node data.
         */
        get: function () {
            if (this._data != null && this._data != undefined) {
                if (typeof this._data == "number") {
                    return this._data;
                }
                else if (typeof this._data == "object") {
                    if (this._data.hasOwnProperty('value')) {
                        return this._data['value'];
                    }
                }
            }
            // the node has no value if data is undefined
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "min", {
        /**
         * Access the minimum value in the immediate child list (typically used for ordered child collections)
         *
         * @returns zero if there are no children or minimum value among ONLY the immediate children of this node
         */
        get: function () {
            if (this._children == 0) {
                return 0;
            }
            if (!this._ordered) {
                // update bounds
                this.__getBounds();
            }
            return this._min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "max", {
        get: function () {
            if (this._children == 0) {
                return 0;
            }
            if (!this._ordered) {
                // update bounds
                this.__getBounds();
            }
            return this._max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "hasChildren", {
        /**
         * Does this node have a child list?
         *
         * @returns boolean True if there this node has children
         *
         */
        get: function () {
            return this._children > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$TreeNode.prototype, "childIdList", {
        /**
         * Return the list of child ids in an array of string
         *
         * @returns Array<string> List of each child id or an empty array if there are no children
         */
        get: function () {
            var list = new Array();
            var nodeList = this._head;
            while (nodeList.next != null) {
                if (nodeList.node !== null) {
                    list.push(nodeList.node.id);
                }
                nodeList = nodeList.next;
            }
            if (this._tail.node != null) {
                list.push(this._tail.node.id);
            }
            return list;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add a child to this node
     *
     * @param node: TSMT$TreeNode<T> Reference to the new child
     *
     * @return nothing The child is added to the child list, provided the input is valid.  If the child list is ordered,
     * the node must have a comparable value
     */
    TSMT$TreeNode.prototype.addChild = function (node) {
        if ((node !== undefined && node != null && node instanceof TSMT$TreeNode)) {
            node.parent = this;
            if (this._ordered) {
                // add node into appropriate slot and adjust child list
                this.__insertOrderedNode(node);
            }
            else {
                // append to end of list
                this.__appendNode(node);
            }
            this._min = Math.min(this._min, node.value);
            this._max = Math.max(this._max, node.value);
            node.parent = this;
            this._children++;
        }
    };
    /**
     * Insert a node into the child list in order of increasing value
     *
     * @param node: TSMT$TreeNode<T> Reference to node to be appended
     *
     * @returns nothing
     *
     * @private
     */
    TSMT$TreeNode.prototype.__insertOrderedNode = function (node) {
        var v = node.value;
        // if there is only one node, life is easy, either insert before or after head
        if (this._children == 1) {
            if (v >= node.value) {
                // append to end
                this.__appendNode(node);
            }
            else {
                // prepend before head
                this.__prependNode(node);
            }
            return;
        }
        // have to do it the hard way ... traverse the child list to find an insertion point
        var list = this._tail;
        var n;
        var listNode;
        while (list.prev != null) {
            n = list.node;
            if (v > n.value) {
                // insert after tail?
                if (list.next == null) {
                    this.__appendNode(node);
                }
                else {
                    listNode = { prev: list, next: list.next, node: node };
                    list.next = listNode;
                    list.next.prev = listNode;
                }
                return;
            }
            list = list.prev;
        }
        // have to modify the head?
        if (this._children == 0) {
            this._head.node = node;
        }
        else {
            // insert before head
            this.__prependNode(node);
        }
    };
    /**
     * Prepend a node ahead of the current head of the direct child list
     *
     * @param node: TSMT$TreeNode<T> Reference to node to be appended
     *
     * @returns nothing
     *
     * @private
     */
    TSMT$TreeNode.prototype.__prependNode = function (node) {
        var listNode = { prev: null, next: this._head, node: node };
        this._head.prev = listNode;
        this._head = listNode;
    };
    /**
     * Append a node onto the end of the child list
     *
     * @param node: TSMT$TreeNode<T> Reference to node to be appended
     *
     * @returns nothing
     *
     * @private
     */
    TSMT$TreeNode.prototype.__appendNode = function (node) {
        if (this._children == 0) {
            this._head.node = node;
        }
        else {
            var listNode = { prev: this._tail, next: null, node: node };
            this._tail.next = listNode;
            this._tail = listNode;
        }
    };
    /**
     * Delete a child from this node's child list
     *
     * @returns nothing The specified node is deleted provided that its id *exactly* matches an id in the  child list.
     * The deleted node is automatically cleared.
     */
    TSMT$TreeNode.prototype.deleteChild = function (node) {
        if (node !== undefined && node != null) {
            var n = this.deleteChildByID(node.id);
            if (n !== null) {
                n.clear();
            }
            // update bounds
            this.__getBounds();
        }
    };
    /**
     * Delete the child in this node's child list with the specified id
     *
     * @param id: string Node id
     *
     * @returns TSMT$TreeNode<T> Reference to a node in the child list that will be deleted from that list; it is the
     * caller's responsibility to clear the node if it will no longer be needed.  Otherwise, it's child list and
     * hierarchy remains independently intact.  Returns null if no node in the child list is found with a matching id.
     */
    TSMT$TreeNode.prototype.deleteChildByID = function (id) {
        if (this._children == 0) {
            return null;
        }
        var list = this._head;
        var node = list.node;
        // delete head node?
        if (node.id == id) {
            // update head reference
            this._head = this._children == 1 ? { prev: null, next: null, node: null } : list.next;
            if (list.next) {
                list.next.prev = null;
            }
            // if only one node, then tail must be fixed as well
            if (this._children == 1) {
                this._tail = this._head;
            }
            this._children--;
            return node;
        }
        // delete interior node?
        while (list.next != null) {
            list = list.next;
            node = list.node;
            if (node.id == id) {
                // deleting tail node?
                if (this._tail.node.id == id) {
                    this._tail.prev.next = null;
                    this._tail = this._tail.prev;
                }
                else {
                    list.prev.next = list.next;
                    list.next.prev = list.prev;
                }
                this._children--;
                return node;
            }
        }
        return null;
    };
    /**
     * Compare two tree nodes, generally for the purpose of determining a traversal direction
     *
     * @param node: T Reference to an input node for comparison
     *
     * @return number 0 if the current node value is less than the input node value and 1 otherwise, which doubles
     * as a search direction
     */
    TSMT$TreeNode.prototype.compare = function (node) {
        if (node == undefined || node == null) {
            return NaN;
        }
        return this.value < node.value ? 0 : 1;
    };
    /**
     * Compare two binary tree nodes for less than, equal to, or greater than in value
     *
     * @param node: T Reference to an input node for comparison
     *
     * @return number -1 if the current node value is less than the input node, 0 if equal, and and 1 if greater; note
     * that nodes with numerical values may be require and approx-equal comparison which could be implemented in a
     * future version.
     */
    TSMT$TreeNode.prototype.compareTo = function (node) {
        if (node == undefined || node == null) {
            return NaN;
        }
        return this.value < node.value ? -1 : this.value == node.value ? 0 : 1;
    };
    /**
     * Clear the child list of this node
     *
     * @returns Nothing Child list is nulled out and children count is set to zero (this preps the child list for garbage
     * collection)
     */
    TSMT$TreeNode.prototype.clear = function () {
        var list = this._head;
        while (list.next != null) {
            var tmp = list;
            list = list.next;
            tmp.prev = null;
            tmp.next = null;
            if (tmp.node.hasChildren) {
                tmp.node.clear();
            }
            tmp.node = null;
        }
        // finish off tail
        if (this._tail.node && this._tail.node.hasChildren) {
            this._tail.node.clear();
        }
        this._head = { prev: null, next: null, node: null };
        this._tail = this._head;
        this._children = 0;
    };
    /**
     * Update min/max values for the direct child list
     *
     * @private
     */
    TSMT$TreeNode.prototype.__getBounds = function () {
        this._min = Number.MAX_VALUE;
        this._max = Number.MIN_VALUE;
        // no kiddies, nothing to do :)
        if (this._children == 0) {
            return;
        }
        var list = this._head;
        var v;
        while (list.node && list.next != null) {
            v = list.node.value;
            this._min = Math.min(this._min, v);
            this._max = Math.max(this._max, v);
            list = list.next;
        }
        v = this._tail.node.value;
        this._min = Math.min(this._min, v);
        this._max = Math.max(this._max, v);
    };
    return TSMT$TreeNode;
}());
exports.TSMT$TreeNode = TSMT$TreeNode;
