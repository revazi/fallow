# Non-JavaScript Module Input Design

## Goal

Reduce avoidable unit interfacing risk in the non-JavaScript module constructor without changing extraction behavior or widening the public API.

## Baseline

The fresh SIG scan identifies Unit Interfacing as the weakest actionable property. The private `non_js_module_info` helper currently accepts six independent inputs and is called by the CSS and SFC extractors. The helper is a stable seam because its inputs describe one construction request and its output is already a single `ModuleInfo` value.

## Approach

Introduce a crate-visible `NonJsModuleInfoInput` struct containing the existing six values:

- file id
- content hash
- source text
- parsed suppressions
- imports
- exports

Change `non_js_module_info` to accept one `NonJsModuleInfoInput`. Update the CSS and SFC callers to construct the input at the call site. Keep the struct and function crate-visible because the module itself is private to `fallow-extract`.

This approach is preferred over changing frozen public analyzer APIs or bundling the larger health-scoring input seam. It is smaller, has two production callers, and keeps the refactor at a clear constructor boundary.

## Behavior and compatibility

The `ModuleInfo` initializer remains unchanged. The refactor only changes how its six construction inputs are grouped. No serialized output, extraction rule, ownership, or runtime behavior changes.

## Validation

1. Run the focused extract tests covering CSS and SFC module construction.
2. Run `cargo fmt --all -- --check` and `cargo clippy --workspace --all-targets -- -D warnings`.
3. Run `cargo test --workspace --all-targets`.
4. Run a real-project analyzer smoke test and compare its semantic output before and after the refactor.
5. Re-run the SIG measurements and keep the change only if Unit Interfacing improves without regression in Unit Size, Unit Complexity, or test results.

The unrelated working-tree change in `CHANGELOG.md` is not part of this design or its implementation.
