class Node {
    constructor(state, cost, parent, action) {
        this.state = state;
        this.cost = cost;
        this.parent = parent;
        this.action = action;
    }
}
class BestFirstSearch {
    search(problem) {
        let node = new Node(problem.start, 0);
        const visited = new Map();
        const queue = [node];
        visited.set(problem.start, node);
        while (queue.length > 0) {
            node = queue.pop();
            if (problem.isGoal(node.state)) {
                return node;
            }
            for (const action of problem.getActions(node.state)) {
                const newState = problem.getResult(node.state, action);
                const cost = node.cost + problem.getCost(node.state, action, newState);
                const newNode = new Node(newState, cost, node, action);
                if (!visited.has(newState) || newNode.cost < visited.get(newState).cost) {
                    visited.set(newState, newNode);
                    queue.push(newNode);
                    queue.sort((a, b) => b.cost - a.cost);
                }
            }
        }
        return null;
    }
}
export { Node, BestFirstSearch };
