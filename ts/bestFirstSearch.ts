class Node {
    constructor(
        public readonly state: string, public readonly cost: number,
        public readonly parent?: Node, public readonly action?: string
    ) {}
}

interface SearchProblem {
    start: string;
    getActions(current: string): string[];
    isGoal(current: string): boolean;
    getResult(current: string, action: string): string;
    getCost(from: string, action: string, to: string): number;
}

class BestFirstSearch {
    search(problem: SearchProblem): Node | null {
        let node = new Node(problem.start, 0)
        const visited = new Map<string, Node>();
        const queue: Node[] = [node];
        visited.set(problem.start, node);
        while (queue.length > 0) {
            node = queue.pop()!;
            if (problem.isGoal(node.state)) { return node; }
            for (const action of problem.getActions(node.state)) {
                const newState = problem.getResult(node.state, action);
                const cost = node.cost + problem.getCost(node.state, action, newState);
                const newNode = new Node(newState, cost, node, action);
                if (!visited.has(newState) || newNode.cost < visited.get(newState)!.cost) {
                    visited.set(newState, newNode);
                    queue.push(newNode);
                    queue.sort((a, b) => b.cost - a.cost);
                }
            }
        }
        return null;
    }
}

export { Node, SearchProblem, BestFirstSearch };