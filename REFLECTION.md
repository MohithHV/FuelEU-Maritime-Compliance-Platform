# Development Reflection: Building FuelEU Maritime Platform with AI Agents

## Introduction

This document reflects on the experience of building a full-stack maritime compliance platform using AI agents, specifically Claude Code, to accelerate development while maintaining code quality and architectural integrity.

---

## What I Learned Using AI Agents

### 1. **AI Agents as Architectural Partners**

One of the most surprising discoveries was how effectively AI agents can assist with high-level architectural decisions, not just code generation. When I provided the requirement for "hexagonal architecture," Claude Code didn't just create folder structures—it understood the fundamental principles:

- **Dependency inversion**: Core domain never depends on infrastructure
- **Port-adapter pattern**: Clear interfaces between layers
- **Testability**: Business logic isolated from frameworks

**Key Learning**: AI agents can serve as architecture consultants when given proper context. By explaining *why* we need hexagonal architecture (maintainability, testability, framework independence), the agent generated more thoughtful solutions than a simple "create this folder structure" prompt would have produced.

### 2. **The Iterative Refinement Loop**

Initially, I approached AI-assisted development as a one-shot generation tool: write a prompt, get code, move on. This proved inefficient. The breakthrough came when I treated Claude Code as a pair programming partner:

**Old approach**: "Build a banking controller"
**Result**: Generic CRUD operations, missing business rules

**New approach**:
1. "Build a banking controller for FuelEU compliance"
2. Review generated code
3. "Add validation: CB must be positive to bank"
4. Review again
5. "Add error handling for insufficient balance"
6. Final review and minor tweaks
**Result**: Production-ready controller with proper business logic

**Key Learning**: The conversation model is the superpower. Each iteration refines the output, and the AI maintains context across the discussion. This iterative loop often produces better code than I would write manually on the first try.

### 3. **Domain-Specific Knowledge Integration**

The FuelEU Maritime regulation has specific formulas and rules:
- Compliance Balance = (Target - Actual) × Energy in scope
- Target intensity for 2025 = 89.3368 gCO₂e/MJ
- Pooling rules: sum(CB) ≥ 0, deficit ships can't exit worse, etc.

When I provided these domain-specific rules with context, the AI agent:
- Implemented formulas correctly
- Added proper validation
- Created meaningful variable names (cbGco2eq, ghgIntensity, etc.)
- Included calculation comments referencing the regulation

**Key Learning**: AI agents excel at implementing well-specified business logic. The quality of domain modeling depends heavily on how well you communicate the requirements. Vague prompts lead to generic code; specific business context leads to domain-rich implementations.

### 4. **Boilerplate vs. Creative Work**

AI agents dramatically accelerated boilerplate code generation:

**Boilerplate (95%+ accuracy)**:
- TypeScript interfaces matching backend DTOs
- CRUD repository methods
- Express route definitions
- React component scaffolding
- Configuration files (tsconfig, eslint, etc.)

**Creative/Complex Work (requires validation)**:
- Pooling greedy allocation algorithm
- Complex business rule validation
- State management patterns
- Error handling strategies

**Key Learning**: Use AI agents differently based on task type. For boilerplate, accept and move fast. For complex logic, generate then validate thoroughly. This two-speed approach optimizes both velocity and quality.

---

## Efficiency Gains vs. Manual Coding

### Time Comparison Estimates

Based on my development experience, here's an honest comparison:

| Task | Manual Est. | With AI | Savings |
|------|-------------|---------|---------|
| Project setup (configs, folder structure) | 2 hours | 15 min | 1h 45m |
| Database schema + Prisma setup | 3 hours | 30 min | 2h 30m |
| Domain models (5 entities) | 4 hours | 45 min | 3h 15m |
| Use cases (7 use cases) | 6 hours | 1h 30m | 4h 30m |
| API controllers + validation | 8 hours | 2 hours | 6 hours |
| Frontend setup + arch | 3 hours | 30 min | 2h 30m |
| React components (20 components) | 16 hours | 4 hours | 12 hours |
| Documentation (3 markdown files) | 4 hours | 1 hour | 3 hours |
| **Total** | **46 hours** | **10.5 hours** | **35.5 hours** |

**Efficiency Gain: ~77% time reduction**

### Qualitative Improvements

Beyond speed, AI assistance improved several aspects:

1. **Consistency**: All code follows the same patterns. Repository methods have consistent signatures, error handling is uniform, component structure is standardized.

2. **Documentation**: I actually created comprehensive documentation (which I often skip when coding manually due to time pressure). The AI made it easy to generate high-quality docs.

3. **Best Practices**: The AI suggested patterns I might not have used:
   - React Query for server state management
   - Dependency injection via factory pattern
   - Centralized error handling middleware

4. **Completeness**: Less likely to forget edge cases. For example, the AI included loading states, empty states, and error boundaries in React components—things I sometimes skip in manual development.

### Hidden Costs

However, there were some efficiency losses:

1. **Validation Time**: ~2 hours spent reviewing and testing generated code
2. **Correction Time**: ~1.5 hours fixing issues (Prisma 7 API changes, type errors)
3. **Learning Curve**: ~1 hour initially learning how to prompt effectively

**Net Efficiency Gain**: Still ~65-70% faster after accounting for hidden costs.

---

## What I Would Do Differently Next Time

### 1. **Start with Domain Modeling Session**

**What I Did**: Jumped straight into code generation
**What I'd Do**: Spend 30-60 minutes with the AI agent doing domain modeling first

Use prompts like:
- "Let's model the FuelEU domain. What entities do we need?"
- "What are the key relationships?"
- "What business rules must we enforce?"

This upfront investment would have prevented later refactoring and ensured richer domain models.

### 2. **Create a "Prompts Library"**

**What I Did**: Re-wrote similar prompts multiple times
**What I'd Do**: Maintain a `prompts.md` file with proven patterns

Example library:
```markdown
## Hexagonal Use Case Pattern
Create a use case for [ACTION] with:
- Constructor injection for repositories
- Input validation
- Error handling
- Return type: Promise<RESULT>

## React Component Pattern
Create a [COMPONENT] that:
- Uses React Query for data fetching
- Has loading/error/empty states
- Is typed with TypeScript
- Follows TailwindCSS conventions
```

This would improve consistency and reduce cognitive load.

### 3. **Test-Driven AI Development**

**What I Did**: Generated code, then thought about tests
**What I'd Do**: Write test specifications first, then generate implementation

Better approach:
1. "Create test specifications for BankSurplusUseCase covering: happy path, negative CB, insufficient balance"
2. Review test specs
3. "Now implement the use case to pass these tests"

This would ensure better test coverage and catch edge cases earlier.

### 4. **Incremental Validation**

**What I Did**: Generated large chunks of code (entire controllers, multiple components) before validating
**What I'd Do**: Generate smaller increments and validate continuously

For example, instead of "build all 4 tabs," do:
1. Generate Routes tab
2. Compile and test in browser
3. Fix any issues
4. Generate Compare tab
5. Repeat

This prevents compounding errors and maintains confidence in the codebase.

### 5. **Explicit Context Management**

**What I Did**: Assumed the AI remembered all previous context
**What I'd Do**: Explicitly reinforce critical context in new prompts

Example:
```
"Remember we're using hexagonal architecture where:
- Domain layer has NO framework dependencies
- Use cases depend on port interfaces
- Infrastructure implements ports

Now create the PoolingController..."
```

This reduces context drift and maintains architectural consistency.

### 6. **AI-Assisted Code Review**

**What I Did**: Manual code review only
**What I'd Do**: Use AI for initial code review

After generation, ask:
- "Review this code for potential bugs"
- "Check if this follows SOLID principles"
- "Are there any security vulnerabilities?"

Then do human review. Two-layer review catches more issues.

### 7. **Better Error Handling Documentation**

**What I Did**: Generated error handling ad-hoc
**What I'd Do**: Define error handling strategy first

Create `ERROR_HANDLING_SPEC.md` with:
- Standard error response format
- HTTP status code conventions
- Validation error patterns
- Logging strategy

Then reference this in all controller generation prompts. This ensures consistency across the entire API.

---

## Reflections on AI-Assisted Development

### The Good

1. **Democratization of Best Practices**: AI agents bring enterprise-level patterns to individual developers. I got hexagonal architecture, dependency injection, and comprehensive testing—patterns I knew conceptually but might not have fully implemented manually.

2. **Reduced Decision Fatigue**: Countless micro-decisions (naming, structure, patterns) are made for you. This frees mental energy for actual business logic.

3. **Learning Accelerator**: Seeing well-structured code generated helps you learn. I picked up new React Query patterns and Prisma techniques from the AI's output.

4. **Documentation Made Easy**: No longer an afterthought. When documentation generation is this easy, you actually do it.

### The Concerning

1. **Over-Reliance Risk**: There's a temptation to accept code without fully understanding it. This is dangerous long-term—you still need to understand what you're deploying.

2. **Subtle Bugs**: AI-generated code can have logic errors that pass TypeScript checks and look correct on surface review. Requires diligent testing.

3. **Architectural Drift**: Without clear guidance, AI might suggest patterns inconsistent with your architecture. Requires strong code review discipline.

4. **Framework Version Hell**: AI training data has a cutoff. Recent library updates (like Prisma 7) require manual intervention.

### The Future

I believe AI-assisted development will evolve into a standard practice, similar to how we now consider version control and CI/CD essential. The key is treating AI as a force multiplier, not a replacement for engineering judgment.

**The Ideal Workflow**:
1. Human defines requirements and architecture
2. AI generates implementation
3. Human reviews and validates
4. AI assists with testing and documentation
5. Human makes final decisions

This human-AI collaboration leverages the strengths of both: human creativity and judgment + AI speed and consistency.

---

## Conclusion

Building the FuelEU Maritime Compliance Platform with AI agents was a transformative experience. The **~70% time savings** were significant, but the qualitative improvements—consistency, documentation, best practices—were equally valuable.

The key learnings:
- **Be specific** in prompts; vague input yields generic output
- **Iterate** conversationally; first draft is rarely final
- **Validate** thoroughly; AI can make mistakes
- **Learn** from generated code; it's an educational tool
- **Stay in control**; AI assists, humans decide

For the next project, I would:
- Start with domain modeling
- Create a prompts library
- Use test-driven AI development
- Validate incrementally
- Define standards upfront (error handling, patterns)
- Use AI for code review assistance

**Final Thought**: AI-assisted development is not about replacing developers—it's about elevating them. It handles the tedious, freeing developers to focus on creativity, architecture, and business value. Used wisely, it's a superpower. Used carelessly, it's a liability.

The future of software development is collaborative—humans and AI, together, building better software faster.

---

**Word Count**: ~1,800 words
**Time to Write**: 45 minutes (with AI assistance for structuring, naturally)
**Irony Level**: Maximum 😊
