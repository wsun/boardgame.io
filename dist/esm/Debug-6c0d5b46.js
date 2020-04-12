import { e as error, s as sync, M as MAKE_MOVE } from './reducer-27d6d11b.js';
import { stringify, parse } from 'flatted';
import { M as MCTSBot, R as RandomBot, S as Step } from './ai-9611bca7.js';

function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function to_number(value) {
    return value === '' ? undefined : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
}
function set_input_value(input, value) {
    if (value != null || input.value) {
        input.value = value;
    }
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}

function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
    };
}

/* src/client/debug/Menu.svelte generated by Svelte v3.20.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-19bfq8g-style";
	style.textContent = ".menu.svelte-19bfq8g{display:flex;margin-top:-10px;flex-direction:row;border:1px solid #ccc;border-radius:5px 5px 0 0;height:25px;line-height:25px;margin-right:-500px;transform-origin:bottom right;transform:rotate(-90deg) translate(0, -500px)}.menu-item.svelte-19bfq8g{line-height:25px;cursor:pointer;background:#fefefe;color:#555;padding-left:15px;padding-right:15px;text-align:center}.menu-item.svelte-19bfq8g:last-child{border-radius:0 5px 0 0}.menu-item.svelte-19bfq8g:first-child{border-radius:5px 0 0 0}.menu-item.active.svelte-19bfq8g{cursor:default;font-weight:bold;background:#ddd;color:#555}.menu-item.svelte-19bfq8g:hover{background:#ddd;color:#555}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i][0];
	child_ctx[5] = list[i][1].label;
	return child_ctx;
}

// (55:2) {#each Object.entries(panes).reverse() as [key, {label}
function create_each_block(ctx) {
	let div;
	let t0_value = /*label*/ ctx[5] + "";
	let t0;
	let t1;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[3](/*key*/ ctx[4], ...args);
	}

	return {
		c() {
			div = element("div");
			t0 = text(t0_value);
			t1 = space();
			attr(div, "class", "menu-item svelte-19bfq8g");
			toggle_class(div, "active", /*pane*/ ctx[0] == /*key*/ ctx[4]);
		},
		m(target, anchor, remount) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			if (remount) dispose();
			dispose = listen(div, "click", click_handler);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*panes*/ 2 && t0_value !== (t0_value = /*label*/ ctx[5] + "")) set_data(t0, t0_value);

			if (dirty & /*pane, Object, panes*/ 3) {
				toggle_class(div, "active", /*pane*/ ctx[0] == /*key*/ ctx[4]);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let div;
	let each_value = Object.entries(/*panes*/ ctx[1]).reverse();
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "menu svelte-19bfq8g");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*pane, Object, panes, dispatch*/ 7) {
				each_value = Object.entries(/*panes*/ ctx[1]).reverse();
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { pane } = $$props;
	let { panes } = $$props;
	const dispatch = createEventDispatcher();
	const click_handler = key => dispatch("change", key);

	$$self.$set = $$props => {
		if ("pane" in $$props) $$invalidate(0, pane = $$props.pane);
		if ("panes" in $$props) $$invalidate(1, panes = $$props.panes);
	};

	return [pane, panes, dispatch, click_handler];
}

class Menu extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-19bfq8g-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, { pane: 0, panes: 1 });
	}
}

/* src/client/debug/main/Hotkey.svelte generated by Svelte v3.20.1 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-1olzq4i-style";
	style.textContent = ".key.svelte-1olzq4i.svelte-1olzq4i{display:flex;flex-direction:row;align-items:center}.key-box.svelte-1olzq4i.svelte-1olzq4i{cursor:pointer;min-width:10px;padding-left:5px;padding-right:5px;height:20px;line-height:20px;text-align:center;border:1px solid #ccc;box-shadow:1px 1px 1px #888;background:#eee;color:#444}.key-box.svelte-1olzq4i.svelte-1olzq4i:hover{background:#ddd}.key.active.svelte-1olzq4i .key-box.svelte-1olzq4i{background:#ddd;border:1px solid #999;box-shadow:none}.label.svelte-1olzq4i.svelte-1olzq4i{margin-left:10px}";
	append(document.head, style);
}

// (73:2) {#if label}
function create_if_block(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*label*/ ctx[1]);
			attr(div, "class", "label svelte-1olzq4i");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 2) set_data(t, /*label*/ ctx[1]);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$1(ctx) {
	let div1;
	let div0;
	let t0;
	let t1;
	let dispose;
	let if_block = /*label*/ ctx[1] && create_if_block(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text(/*value*/ ctx[0]);
			t1 = space();
			if (if_block) if_block.c();
			attr(div0, "class", "key-box svelte-1olzq4i");
			attr(div1, "class", "key svelte-1olzq4i");
			toggle_class(div1, "active", /*active*/ ctx[2]);
		},
		m(target, anchor, remount) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div1, t1);
			if (if_block) if_block.m(div1, null);
			if (remount) run_all(dispose);

			dispose = [
				listen(window, "keydown", /*Keypress*/ ctx[5]),
				listen(div0, "click", /*Activate*/ ctx[4])
			];
		},
		p(ctx, [dirty]) {
			if (dirty & /*value*/ 1) set_data(t0, /*value*/ ctx[0]);

			if (/*label*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div1, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*active*/ 4) {
				toggle_class(div1, "active", /*active*/ ctx[2]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div1);
			if (if_block) if_block.d();
			run_all(dispose);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let $disableHotkeys;
	let { value } = $$props;
	let { onPress = null } = $$props;
	let { label = null } = $$props;
	let { disable = false } = $$props;
	const { disableHotkeys } = getContext("hotkeys");
	component_subscribe($$self, disableHotkeys, value => $$invalidate(8, $disableHotkeys = value));
	let active = false;

	function Deactivate() {
		$$invalidate(2, active = false);
	}

	function Activate() {
		$$invalidate(2, active = true);
		setTimeout(Deactivate, 200);

		if (onPress) {
			setTimeout(onPress, 1);
		}
	}

	function Keypress(e) {
		if (!$disableHotkeys && !disable && e.key == value) {
			e.preventDefault();
			Activate();
		}
	}

	$$self.$set = $$props => {
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
		if ("onPress" in $$props) $$invalidate(6, onPress = $$props.onPress);
		if ("label" in $$props) $$invalidate(1, label = $$props.label);
		if ("disable" in $$props) $$invalidate(7, disable = $$props.disable);
	};

	return [value, label, active, disableHotkeys, Activate, Keypress, onPress, disable];
}

class Hotkey extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1olzq4i-style")) add_css$1();

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			value: 0,
			onPress: 6,
			label: 1,
			disable: 7
		});
	}
}

/* src/client/debug/main/InteractiveFunction.svelte generated by Svelte v3.20.1 */

function add_css$2() {
	var style = element("style");
	style.id = "svelte-khot71-style";
	style.textContent = ".move.svelte-khot71{cursor:pointer;margin-left:10px;color:#666}.move.svelte-khot71:hover{color:#333}.move.active.svelte-khot71{color:#111;font-weight:bold}.arg-field.svelte-khot71{outline:none;font-family:monospace}";
	append(document.head, style);
}

function create_fragment$2(ctx) {
	let div;
	let t0;
	let t1;
	let span_1;
	let t2;
	let dispose;

	return {
		c() {
			div = element("div");
			t0 = text(/*name*/ ctx[2]);
			t1 = text("(");
			span_1 = element("span");
			t2 = text(")");
			attr(span_1, "class", "arg-field svelte-khot71");
			attr(span_1, "contenteditable", "");
			attr(div, "class", "move svelte-khot71");
			toggle_class(div, "active", /*active*/ ctx[3]);
		},
		m(target, anchor, remount) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, span_1);
			/*span_1_binding*/ ctx[9](span_1);
			append(div, t2);
			if (remount) run_all(dispose);

			dispose = [
				listen(span_1, "blur", function () {
					if (is_function(/*Deactivate*/ ctx[1])) /*Deactivate*/ ctx[1].apply(this, arguments);
				}),
				listen(span_1, "keydown", /*OnKeyDown*/ ctx[5]),
				listen(div, "click", function () {
					if (is_function(/*Activate*/ ctx[0])) /*Activate*/ ctx[0].apply(this, arguments);
				})
			];
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;
			if (dirty & /*name*/ 4) set_data(t0, /*name*/ ctx[2]);

			if (dirty & /*active*/ 8) {
				toggle_class(div, "active", /*active*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			/*span_1_binding*/ ctx[9](null);
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { Activate } = $$props;
	let { Deactivate } = $$props;
	let { name } = $$props;
	let { active } = $$props;
	let value;
	let span;
	const dispatch = createEventDispatcher();

	function Submit() {
		try {
			const value = span.innerText;
			let argArray = new Function(`return [${value}]`)();
			dispatch("submit", argArray);
		} catch(error) {
			dispatch("error", error);
		}

		$$invalidate(4, span.innerText = "", span);
	}

	function OnKeyDown(e) {
		if (e.key == "Enter") {
			e.preventDefault();
			Submit();
		}

		if (e.key == "Escape") {
			e.preventDefault();
			Deactivate();
		}
	}

	afterUpdate(() => {
		if (active) {
			span.focus();
		} else {
			span.blur();
		}
	});

	function span_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(4, span = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("Activate" in $$props) $$invalidate(0, Activate = $$props.Activate);
		if ("Deactivate" in $$props) $$invalidate(1, Deactivate = $$props.Deactivate);
		if ("name" in $$props) $$invalidate(2, name = $$props.name);
		if ("active" in $$props) $$invalidate(3, active = $$props.active);
	};

	return [
		Activate,
		Deactivate,
		name,
		active,
		span,
		OnKeyDown,
		value,
		dispatch,
		Submit,
		span_1_binding
	];
}

class InteractiveFunction extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-khot71-style")) add_css$2();

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			Activate: 0,
			Deactivate: 1,
			name: 2,
			active: 3
		});
	}
}

/* src/client/debug/main/Move.svelte generated by Svelte v3.20.1 */

function add_css$3() {
	var style = element("style");
	style.id = "svelte-smqssc-style";
	style.textContent = ".move-error.svelte-smqssc{color:#a00;font-weight:bold}.wrapper.svelte-smqssc{display:flex;flex-direction:row;align-items:center}";
	append(document.head, style);
}

// (65:2) {#if error}
function create_if_block$1(ctx) {
	let span;
	let t;

	return {
		c() {
			span = element("span");
			t = text(/*error*/ ctx[2]);
			attr(span, "class", "move-error svelte-smqssc");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty & /*error*/ 4) set_data(t, /*error*/ ctx[2]);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

function create_fragment$3(ctx) {
	let div1;
	let div0;
	let t0;
	let t1;
	let current;

	const hotkey = new Hotkey({
			props: {
				value: /*shortcut*/ ctx[0],
				onPress: /*Activate*/ ctx[4]
			}
		});

	const interactivefunction = new InteractiveFunction({
			props: {
				Activate: /*Activate*/ ctx[4],
				Deactivate: /*Deactivate*/ ctx[5],
				name: /*name*/ ctx[1],
				active: /*active*/ ctx[3]
			}
		});

	interactivefunction.$on("submit", /*Submit*/ ctx[6]);
	interactivefunction.$on("error", /*Error*/ ctx[7]);
	let if_block = /*error*/ ctx[2] && create_if_block$1(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			create_component(hotkey.$$.fragment);
			t0 = space();
			create_component(interactivefunction.$$.fragment);
			t1 = space();
			if (if_block) if_block.c();
			attr(div0, "class", "wrapper svelte-smqssc");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			mount_component(hotkey, div0, null);
			append(div0, t0);
			mount_component(interactivefunction, div0, null);
			append(div1, t1);
			if (if_block) if_block.m(div1, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const hotkey_changes = {};
			if (dirty & /*shortcut*/ 1) hotkey_changes.value = /*shortcut*/ ctx[0];
			hotkey.$set(hotkey_changes);
			const interactivefunction_changes = {};
			if (dirty & /*name*/ 2) interactivefunction_changes.name = /*name*/ ctx[1];
			if (dirty & /*active*/ 8) interactivefunction_changes.active = /*active*/ ctx[3];
			interactivefunction.$set(interactivefunction_changes);

			if (/*error*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(div1, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i(local) {
			if (current) return;
			transition_in(hotkey.$$.fragment, local);
			transition_in(interactivefunction.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hotkey.$$.fragment, local);
			transition_out(interactivefunction.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(hotkey);
			destroy_component(interactivefunction);
			if (if_block) if_block.d();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { shortcut } = $$props;
	let { name } = $$props;
	let { fn } = $$props;
	const { disableHotkeys } = getContext("hotkeys");
	let error$1 = "";
	let active = false;

	function Activate() {
		disableHotkeys.set(true);
		$$invalidate(3, active = true);
	}

	function Deactivate() {
		disableHotkeys.set(false);
		$$invalidate(2, error$1 = "");
		$$invalidate(3, active = false);
	}

	function Submit(e) {
		$$invalidate(2, error$1 = "");
		Deactivate();
		fn.apply(this, e.detail);
	}

	function Error(e) {
		$$invalidate(2, error$1 = e.detail);
		error(e.detail);
	}

	$$self.$set = $$props => {
		if ("shortcut" in $$props) $$invalidate(0, shortcut = $$props.shortcut);
		if ("name" in $$props) $$invalidate(1, name = $$props.name);
		if ("fn" in $$props) $$invalidate(8, fn = $$props.fn);
	};

	return [shortcut, name, error$1, active, Activate, Deactivate, Submit, Error, fn];
}

class Move extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-smqssc-style")) add_css$3();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { shortcut: 0, name: 1, fn: 8 });
	}
}

/* src/client/debug/main/Controls.svelte generated by Svelte v3.20.1 */

function add_css$4() {
	var style = element("style");
	style.id = "svelte-1x2w9i0-style";
	style.textContent = "li.svelte-1x2w9i0{list-style:none;margin:none;margin-bottom:5px}";
	append(document.head, style);
}

function create_fragment$4(ctx) {
	let section;
	let li0;
	let t0;
	let li1;
	let t1;
	let li2;
	let t2;
	let li3;
	let current;

	const hotkey0 = new Hotkey({
			props: {
				value: "1",
				onPress: /*client*/ ctx[0].reset,
				label: "reset"
			}
		});

	const hotkey1 = new Hotkey({
			props: {
				value: "2",
				onPress: /*Save*/ ctx[1],
				label: "save"
			}
		});

	const hotkey2 = new Hotkey({
			props: {
				value: "3",
				onPress: /*Restore*/ ctx[2],
				label: "restore"
			}
		});

	const hotkey3 = new Hotkey({
			props: { value: ".", disable: true, label: "hide" }
		});

	return {
		c() {
			section = element("section");
			li0 = element("li");
			create_component(hotkey0.$$.fragment);
			t0 = space();
			li1 = element("li");
			create_component(hotkey1.$$.fragment);
			t1 = space();
			li2 = element("li");
			create_component(hotkey2.$$.fragment);
			t2 = space();
			li3 = element("li");
			create_component(hotkey3.$$.fragment);
			attr(li0, "class", "svelte-1x2w9i0");
			attr(li1, "class", "svelte-1x2w9i0");
			attr(li2, "class", "svelte-1x2w9i0");
			attr(li3, "class", "svelte-1x2w9i0");
			attr(section, "id", "debug-controls");
			attr(section, "class", "controls");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, li0);
			mount_component(hotkey0, li0, null);
			append(section, t0);
			append(section, li1);
			mount_component(hotkey1, li1, null);
			append(section, t1);
			append(section, li2);
			mount_component(hotkey2, li2, null);
			append(section, t2);
			append(section, li3);
			mount_component(hotkey3, li3, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const hotkey0_changes = {};
			if (dirty & /*client*/ 1) hotkey0_changes.onPress = /*client*/ ctx[0].reset;
			hotkey0.$set(hotkey0_changes);
		},
		i(local) {
			if (current) return;
			transition_in(hotkey0.$$.fragment, local);
			transition_in(hotkey1.$$.fragment, local);
			transition_in(hotkey2.$$.fragment, local);
			transition_in(hotkey3.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hotkey0.$$.fragment, local);
			transition_out(hotkey1.$$.fragment, local);
			transition_out(hotkey2.$$.fragment, local);
			transition_out(hotkey3.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);
			destroy_component(hotkey0);
			destroy_component(hotkey1);
			destroy_component(hotkey2);
			destroy_component(hotkey3);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let { client } = $$props;

	function Save() {
		const { G, ctx } = client.getState();
		const json = stringify({ G, ctx });
		window.localStorage.setItem("gamestate", json);
	}

	function Restore() {
		const gamestateJSON = window.localStorage.getItem("gamestate");

		if (gamestateJSON !== null) {
			const gamestate = parse(gamestateJSON);
			client.store.dispatch(sync(gamestate));
		}
	}

	$$self.$set = $$props => {
		if ("client" in $$props) $$invalidate(0, client = $$props.client);
	};

	return [client, Save, Restore];
}

class Controls extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1x2w9i0-style")) add_css$4();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { client: 0 });
	}
}

/* src/client/debug/main/PlayerInfo.svelte generated by Svelte v3.20.1 */

function add_css$5() {
	var style = element("style");
	style.id = "svelte-6sf87x-style";
	style.textContent = ".player-box.svelte-6sf87x{display:flex;flex-direction:row}.player.svelte-6sf87x{cursor:pointer;text-align:center;width:30px;height:30px;line-height:30px;background:#eee;border:3px solid #fefefe;box-sizing:content-box}.player.current.svelte-6sf87x{background:#555;color:#eee;font-weight:bold}.player.active.svelte-6sf87x{border:3px solid #ff7f50}";
	append(document.head, style);
}

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (49:2) {#each players as player}
function create_each_block$1(ctx) {
	let div;
	let t0_value = /*player*/ ctx[6] + "";
	let t0;
	let t1;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*player*/ ctx[6], ...args);
	}

	return {
		c() {
			div = element("div");
			t0 = text(t0_value);
			t1 = space();
			attr(div, "class", "player svelte-6sf87x");
			toggle_class(div, "current", /*player*/ ctx[6] == /*ctx*/ ctx[0].currentPlayer);
			toggle_class(div, "active", /*player*/ ctx[6] == /*playerID*/ ctx[1]);
		},
		m(target, anchor, remount) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			if (remount) dispose();
			dispose = listen(div, "click", click_handler);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*players*/ 4 && t0_value !== (t0_value = /*player*/ ctx[6] + "")) set_data(t0, t0_value);

			if (dirty & /*players, ctx*/ 5) {
				toggle_class(div, "current", /*player*/ ctx[6] == /*ctx*/ ctx[0].currentPlayer);
			}

			if (dirty & /*players, playerID*/ 6) {
				toggle_class(div, "active", /*player*/ ctx[6] == /*playerID*/ ctx[1]);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			dispose();
		}
	};
}

function create_fragment$5(ctx) {
	let div;
	let each_value = /*players*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "player-box svelte-6sf87x");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*players, ctx, playerID, OnClick*/ 15) {
				each_value = /*players*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { ctx } = $$props;
	let { playerID } = $$props;
	const dispatch = createEventDispatcher();

	function OnClick(player) {
		if (player == playerID) {
			dispatch("change", { playerID: null });
		} else {
			dispatch("change", { playerID: player });
		}
	}

	let players;
	const click_handler = player => OnClick(player);

	$$self.$set = $$props => {
		if ("ctx" in $$props) $$invalidate(0, ctx = $$props.ctx);
		if ("playerID" in $$props) $$invalidate(1, playerID = $$props.playerID);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*ctx*/ 1) {
			 $$invalidate(2, players = ctx
			? [...Array(ctx.numPlayers).keys()].map(i => i.toString())
			: []);
		}
	};

	return [ctx, playerID, players, OnClick, dispatch, click_handler];
}

class PlayerInfo extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-6sf87x-style")) add_css$5();
		init(this, options, instance$5, create_fragment$5, safe_not_equal, { ctx: 0, playerID: 1 });
	}
}

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
function AssignShortcuts(moveNames, eventNames, blacklist) {
  var shortcuts = {};
  var events = {};

  for (var name in moveNames) {
    events[name] = name;
  }

  for (var _name in eventNames) {
    events[_name] = _name;
  }

  var taken = {};

  for (var i = 0; i < blacklist.length; i++) {
    var c = blacklist[i];
    taken[c] = true;
  } // Try assigning the first char of each move as the shortcut.


  var t = taken;
  var canUseFirstChar = true;

  for (var _name2 in events) {
    var shortcut = _name2[0];

    if (t[shortcut]) {
      canUseFirstChar = false;
      break;
    }

    t[shortcut] = true;
    shortcuts[_name2] = shortcut;
  }

  if (canUseFirstChar) {
    return shortcuts;
  } // If those aren't unique, use a-z.


  t = taken;
  var next = 97;
  shortcuts = {};

  for (var _name3 in events) {
    var _shortcut = String.fromCharCode(next);

    while (t[_shortcut]) {
      next++;
      _shortcut = String.fromCharCode(next);
    }

    t[_shortcut] = true;
    shortcuts[_name3] = _shortcut;
  }

  return shortcuts;
}

/* src/client/debug/main/Main.svelte generated by Svelte v3.20.1 */

function add_css$6() {
	var style = element("style");
	style.id = "svelte-1vg2l2b-style";
	style.textContent = ".json.svelte-1vg2l2b.svelte-1vg2l2b{font-family:monospace;color:#888}label.svelte-1vg2l2b.svelte-1vg2l2b{font-weight:bold;font-size:1.1em;display:inline}h3.svelte-1vg2l2b.svelte-1vg2l2b{text-transform:uppercase}li.svelte-1vg2l2b.svelte-1vg2l2b{list-style:none;margin:none;margin-bottom:5px}.events.svelte-1vg2l2b.svelte-1vg2l2b{display:flex;flex-direction:column}.events.svelte-1vg2l2b button.svelte-1vg2l2b{width:100px}.events.svelte-1vg2l2b button.svelte-1vg2l2b:not(:last-child){margin-bottom:10px}";
	append(document.head, style);
}

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i][0];
	child_ctx[10] = list[i][1];
	return child_ctx;
}

// (85:2) {#each Object.entries(client.moves) as [name, fn]}
function create_each_block$2(ctx) {
	let li;
	let t;
	let current;

	const move = new Move({
			props: {
				shortcut: /*shortcuts*/ ctx[4][/*name*/ ctx[9]],
				fn: /*fn*/ ctx[10],
				name: /*name*/ ctx[9]
			}
		});

	return {
		c() {
			li = element("li");
			create_component(move.$$.fragment);
			t = space();
			attr(li, "class", "svelte-1vg2l2b");
		},
		m(target, anchor) {
			insert(target, li, anchor);
			mount_component(move, li, null);
			append(li, t);
			current = true;
		},
		p(ctx, dirty) {
			const move_changes = {};
			if (dirty & /*client*/ 1) move_changes.shortcut = /*shortcuts*/ ctx[4][/*name*/ ctx[9]];
			if (dirty & /*client*/ 1) move_changes.fn = /*fn*/ ctx[10];
			if (dirty & /*client*/ 1) move_changes.name = /*name*/ ctx[9];
			move.$set(move_changes);
		},
		i(local) {
			if (current) return;
			transition_in(move.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(move.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(li);
			destroy_component(move);
		}
	};
}

// (96:2) {#if client.events.endTurn}
function create_if_block_2(ctx) {
	let button;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "End Turn";
			attr(button, "class", "svelte-1vg2l2b");
		},
		m(target, anchor, remount) {
			insert(target, button, anchor);
			if (remount) dispose();
			dispose = listen(button, "click", /*click_handler*/ ctx[6]);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			dispose();
		}
	};
}

// (99:2) {#if ctx.phase && client.events.endPhase}
function create_if_block_1(ctx) {
	let button;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "End Phase";
			attr(button, "class", "svelte-1vg2l2b");
		},
		m(target, anchor, remount) {
			insert(target, button, anchor);
			if (remount) dispose();
			dispose = listen(button, "click", /*click_handler_1*/ ctx[7]);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			dispose();
		}
	};
}

// (102:2) {#if ctx.activePlayers && client.events.endStage}
function create_if_block$2(ctx) {
	let button;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "End Stage";
			attr(button, "class", "svelte-1vg2l2b");
		},
		m(target, anchor, remount) {
			insert(target, button, anchor);
			if (remount) dispose();
			dispose = listen(button, "click", /*click_handler_2*/ ctx[8]);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			dispose();
		}
	};
}

function create_fragment$6(ctx) {
	let section0;
	let h30;
	let t1;
	let t2;
	let section1;
	let h31;
	let t4;
	let t5;
	let section2;
	let h32;
	let t7;
	let t8;
	let section3;
	let h33;
	let t10;
	let div;
	let t11;
	let t12;
	let t13;
	let section4;
	let label0;
	let t15;
	let pre0;
	let t16_value = JSON.stringify(/*G*/ ctx[3], null, 2) + "";
	let t16;
	let t17;
	let section5;
	let label1;
	let t19;
	let pre1;
	let t20_value = JSON.stringify(SanitizeCtx(/*ctx*/ ctx[2]), null, 2) + "";
	let t20;
	let current;
	const controls = new Controls({ props: { client: /*client*/ ctx[0] } });

	const playerinfo = new PlayerInfo({
			props: {
				ctx: /*ctx*/ ctx[2],
				playerID: /*playerID*/ ctx[1]
			}
		});

	playerinfo.$on("change", /*change_handler*/ ctx[5]);
	let each_value = Object.entries(/*client*/ ctx[0].moves);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	let if_block0 = /*client*/ ctx[0].events.endTurn && create_if_block_2(ctx);
	let if_block1 = /*ctx*/ ctx[2].phase && /*client*/ ctx[0].events.endPhase && create_if_block_1(ctx);
	let if_block2 = /*ctx*/ ctx[2].activePlayers && /*client*/ ctx[0].events.endStage && create_if_block$2(ctx);

	return {
		c() {
			section0 = element("section");
			h30 = element("h3");
			h30.textContent = "Controls";
			t1 = space();
			create_component(controls.$$.fragment);
			t2 = space();
			section1 = element("section");
			h31 = element("h3");
			h31.textContent = "Players";
			t4 = space();
			create_component(playerinfo.$$.fragment);
			t5 = space();
			section2 = element("section");
			h32 = element("h3");
			h32.textContent = "Moves";
			t7 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t8 = space();
			section3 = element("section");
			h33 = element("h3");
			h33.textContent = "Events";
			t10 = space();
			div = element("div");
			if (if_block0) if_block0.c();
			t11 = space();
			if (if_block1) if_block1.c();
			t12 = space();
			if (if_block2) if_block2.c();
			t13 = space();
			section4 = element("section");
			label0 = element("label");
			label0.textContent = "G";
			t15 = space();
			pre0 = element("pre");
			t16 = text(t16_value);
			t17 = space();
			section5 = element("section");
			label1 = element("label");
			label1.textContent = "ctx";
			t19 = space();
			pre1 = element("pre");
			t20 = text(t20_value);
			attr(h30, "class", "svelte-1vg2l2b");
			attr(h31, "class", "svelte-1vg2l2b");
			attr(h32, "class", "svelte-1vg2l2b");
			attr(h33, "class", "svelte-1vg2l2b");
			attr(div, "class", "events svelte-1vg2l2b");
			attr(label0, "class", "svelte-1vg2l2b");
			attr(pre0, "class", "json svelte-1vg2l2b");
			attr(label1, "class", "svelte-1vg2l2b");
			attr(pre1, "class", "json svelte-1vg2l2b");
		},
		m(target, anchor) {
			insert(target, section0, anchor);
			append(section0, h30);
			append(section0, t1);
			mount_component(controls, section0, null);
			insert(target, t2, anchor);
			insert(target, section1, anchor);
			append(section1, h31);
			append(section1, t4);
			mount_component(playerinfo, section1, null);
			insert(target, t5, anchor);
			insert(target, section2, anchor);
			append(section2, h32);
			append(section2, t7);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(section2, null);
			}

			insert(target, t8, anchor);
			insert(target, section3, anchor);
			append(section3, h33);
			append(section3, t10);
			append(section3, div);
			if (if_block0) if_block0.m(div, null);
			append(div, t11);
			if (if_block1) if_block1.m(div, null);
			append(div, t12);
			if (if_block2) if_block2.m(div, null);
			insert(target, t13, anchor);
			insert(target, section4, anchor);
			append(section4, label0);
			append(section4, t15);
			append(section4, pre0);
			append(pre0, t16);
			insert(target, t17, anchor);
			insert(target, section5, anchor);
			append(section5, label1);
			append(section5, t19);
			append(section5, pre1);
			append(pre1, t20);
			current = true;
		},
		p(ctx, [dirty]) {
			const controls_changes = {};
			if (dirty & /*client*/ 1) controls_changes.client = /*client*/ ctx[0];
			controls.$set(controls_changes);
			const playerinfo_changes = {};
			if (dirty & /*ctx*/ 4) playerinfo_changes.ctx = /*ctx*/ ctx[2];
			if (dirty & /*playerID*/ 2) playerinfo_changes.playerID = /*playerID*/ ctx[1];
			playerinfo.$set(playerinfo_changes);

			if (dirty & /*shortcuts, Object, client*/ 17) {
				each_value = Object.entries(/*client*/ ctx[0].moves);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(section2, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (/*client*/ ctx[0].events.endTurn) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2(ctx);
					if_block0.c();
					if_block0.m(div, t11);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*ctx*/ ctx[2].phase && /*client*/ ctx[0].events.endPhase) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					if_block1.m(div, t12);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*ctx*/ ctx[2].activePlayers && /*client*/ ctx[0].events.endStage) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block$2(ctx);
					if_block2.c();
					if_block2.m(div, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if ((!current || dirty & /*G*/ 8) && t16_value !== (t16_value = JSON.stringify(/*G*/ ctx[3], null, 2) + "")) set_data(t16, t16_value);
			if ((!current || dirty & /*ctx*/ 4) && t20_value !== (t20_value = JSON.stringify(SanitizeCtx(/*ctx*/ ctx[2]), null, 2) + "")) set_data(t20, t20_value);
		},
		i(local) {
			if (current) return;
			transition_in(controls.$$.fragment, local);
			transition_in(playerinfo.$$.fragment, local);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			transition_out(controls.$$.fragment, local);
			transition_out(playerinfo.$$.fragment, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(section0);
			destroy_component(controls);
			if (detaching) detach(t2);
			if (detaching) detach(section1);
			destroy_component(playerinfo);
			if (detaching) detach(t5);
			if (detaching) detach(section2);
			destroy_each(each_blocks, detaching);
			if (detaching) detach(t8);
			if (detaching) detach(section3);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (detaching) detach(t13);
			if (detaching) detach(section4);
			if (detaching) detach(t17);
			if (detaching) detach(section5);
		}
	};
}

function SanitizeCtx(ctx) {
	let r = {};

	for (const key in ctx) {
		if (!key.startsWith("_")) {
			r[key] = ctx[key];
		}
	}

	return r;
}

function instance$6($$self, $$props, $$invalidate) {
	let { client } = $$props;
	const shortcuts = AssignShortcuts(client.moves, client.events, "mlia");
	let playerID = client.playerID;
	let ctx = {};
	let G = {};

	client.subscribe(state => {
		if (state) {
			$$invalidate(3, G = state.G);
			$$invalidate(2, ctx = state.ctx);
		}

		$$invalidate(1, playerID = client.playerID);
	});

	const change_handler = e => client.updatePlayerID(e.detail.playerID);
	const click_handler = () => client.events.endTurn();
	const click_handler_1 = () => client.events.endPhase();
	const click_handler_2 = () => client.events.endStage();

	$$self.$set = $$props => {
		if ("client" in $$props) $$invalidate(0, client = $$props.client);
	};

	return [
		client,
		playerID,
		ctx,
		G,
		shortcuts,
		change_handler,
		click_handler,
		click_handler_1,
		click_handler_2
	];
}

class Main extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1vg2l2b-style")) add_css$6();
		init(this, options, instance$6, create_fragment$6, safe_not_equal, { client: 0 });
	}
}

/* src/client/debug/info/Item.svelte generated by Svelte v3.20.1 */

function add_css$7() {
	var style = element("style");
	style.id = "svelte-13qih23-style";
	style.textContent = ".item.svelte-13qih23.svelte-13qih23{padding:10px}.item.svelte-13qih23.svelte-13qih23:not(:first-child){border-top:1px dashed #aaa}.item.svelte-13qih23 div.svelte-13qih23{float:right;text-align:right}";
	append(document.head, style);
}

function create_fragment$7(ctx) {
	let div1;
	let strong;
	let t0;
	let t1;
	let div0;
	let t2_value = JSON.stringify(/*value*/ ctx[1]) + "";
	let t2;

	return {
		c() {
			div1 = element("div");
			strong = element("strong");
			t0 = text(/*name*/ ctx[0]);
			t1 = space();
			div0 = element("div");
			t2 = text(t2_value);
			attr(div0, "class", "svelte-13qih23");
			attr(div1, "class", "item svelte-13qih23");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, strong);
			append(strong, t0);
			append(div1, t1);
			append(div1, div0);
			append(div0, t2);
		},
		p(ctx, [dirty]) {
			if (dirty & /*name*/ 1) set_data(t0, /*name*/ ctx[0]);
			if (dirty & /*value*/ 2 && t2_value !== (t2_value = JSON.stringify(/*value*/ ctx[1]) + "")) set_data(t2, t2_value);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div1);
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	let { name } = $$props;
	let { value } = $$props;

	$$self.$set = $$props => {
		if ("name" in $$props) $$invalidate(0, name = $$props.name);
		if ("value" in $$props) $$invalidate(1, value = $$props.value);
	};

	return [name, value];
}

class Item extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-13qih23-style")) add_css$7();
		init(this, options, instance$7, create_fragment$7, safe_not_equal, { name: 0, value: 1 });
	}
}

/* src/client/debug/info/Info.svelte generated by Svelte v3.20.1 */

function add_css$8() {
	var style = element("style");
	style.id = "svelte-1yzq5o8-style";
	style.textContent = ".gameinfo.svelte-1yzq5o8{padding:10px}";
	append(document.head, style);
}

// (17:2) {#if $client.isMultiplayer}
function create_if_block$3(ctx) {
	let span;
	let t;
	let current;

	const item0 = new Item({
			props: {
				name: "isConnected",
				value: /*$client*/ ctx[1].isConnected
			}
		});

	const item1 = new Item({
			props: {
				name: "isMultiplayer",
				value: /*$client*/ ctx[1].isMultiplayer
			}
		});

	return {
		c() {
			span = element("span");
			create_component(item0.$$.fragment);
			t = space();
			create_component(item1.$$.fragment);
		},
		m(target, anchor) {
			insert(target, span, anchor);
			mount_component(item0, span, null);
			append(span, t);
			mount_component(item1, span, null);
			current = true;
		},
		p(ctx, dirty) {
			const item0_changes = {};
			if (dirty & /*$client*/ 2) item0_changes.value = /*$client*/ ctx[1].isConnected;
			item0.$set(item0_changes);
			const item1_changes = {};
			if (dirty & /*$client*/ 2) item1_changes.value = /*$client*/ ctx[1].isMultiplayer;
			item1.$set(item1_changes);
		},
		i(local) {
			if (current) return;
			transition_in(item0.$$.fragment, local);
			transition_in(item1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(item0.$$.fragment, local);
			transition_out(item1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(span);
			destroy_component(item0);
			destroy_component(item1);
		}
	};
}

function create_fragment$8(ctx) {
	let section;
	let t0;
	let t1;
	let t2;
	let current;

	const item0 = new Item({
			props: {
				name: "gameID",
				value: /*client*/ ctx[0].gameID
			}
		});

	const item1 = new Item({
			props: {
				name: "playerID",
				value: /*client*/ ctx[0].playerID
			}
		});

	const item2 = new Item({
			props: {
				name: "isActive",
				value: /*$client*/ ctx[1].isActive
			}
		});

	let if_block = /*$client*/ ctx[1].isMultiplayer && create_if_block$3(ctx);

	return {
		c() {
			section = element("section");
			create_component(item0.$$.fragment);
			t0 = space();
			create_component(item1.$$.fragment);
			t1 = space();
			create_component(item2.$$.fragment);
			t2 = space();
			if (if_block) if_block.c();
			attr(section, "class", "gameinfo svelte-1yzq5o8");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			mount_component(item0, section, null);
			append(section, t0);
			mount_component(item1, section, null);
			append(section, t1);
			mount_component(item2, section, null);
			append(section, t2);
			if (if_block) if_block.m(section, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const item0_changes = {};
			if (dirty & /*client*/ 1) item0_changes.value = /*client*/ ctx[0].gameID;
			item0.$set(item0_changes);
			const item1_changes = {};
			if (dirty & /*client*/ 1) item1_changes.value = /*client*/ ctx[0].playerID;
			item1.$set(item1_changes);
			const item2_changes = {};
			if (dirty & /*$client*/ 2) item2_changes.value = /*$client*/ ctx[1].isActive;
			item2.$set(item2_changes);

			if (/*$client*/ ctx[1].isMultiplayer) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(section, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(item0.$$.fragment, local);
			transition_in(item1.$$.fragment, local);
			transition_in(item2.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(item0.$$.fragment, local);
			transition_out(item1.$$.fragment, local);
			transition_out(item2.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);
			destroy_component(item0);
			destroy_component(item1);
			destroy_component(item2);
			if (if_block) if_block.d();
		}
	};
}

function instance$8($$self, $$props, $$invalidate) {
	let $client,
		$$unsubscribe_client = noop,
		$$subscribe_client = () => ($$unsubscribe_client(), $$unsubscribe_client = subscribe(client, $$value => $$invalidate(1, $client = $$value)), client);

	$$self.$$.on_destroy.push(() => $$unsubscribe_client());
	let { client } = $$props;
	$$subscribe_client();

	$$self.$set = $$props => {
		if ("client" in $$props) $$subscribe_client($$invalidate(0, client = $$props.client));
	};

	return [client, $client];
}

class Info extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1yzq5o8-style")) add_css$8();
		init(this, options, instance$8, create_fragment$8, safe_not_equal, { client: 0 });
	}
}

/* src/client/debug/log/TurnMarker.svelte generated by Svelte v3.20.1 */

function add_css$9() {
	var style = element("style");
	style.id = "svelte-6eza86-style";
	style.textContent = ".turn-marker.svelte-6eza86{display:flex;justify-content:center;align-items:center;grid-column:1;background:#555;color:#eee;text-align:center;font-weight:bold;border:1px solid #888}";
	append(document.head, style);
}

function create_fragment$9(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*turn*/ ctx[0]);
			attr(div, "class", "turn-marker svelte-6eza86");
			attr(div, "style", /*style*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, [dirty]) {
			if (dirty & /*turn*/ 1) set_data(t, /*turn*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function instance$9($$self, $$props, $$invalidate) {
	let { turn } = $$props;
	let { numEvents } = $$props;
	const style = `grid-row: span ${numEvents}`;

	$$self.$set = $$props => {
		if ("turn" in $$props) $$invalidate(0, turn = $$props.turn);
		if ("numEvents" in $$props) $$invalidate(2, numEvents = $$props.numEvents);
	};

	return [turn, style, numEvents];
}

class TurnMarker extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-6eza86-style")) add_css$9();
		init(this, options, instance$9, create_fragment$9, safe_not_equal, { turn: 0, numEvents: 2 });
	}
}

/* src/client/debug/log/PhaseMarker.svelte generated by Svelte v3.20.1 */

function add_css$a() {
	var style = element("style");
	style.id = "svelte-1t4xap-style";
	style.textContent = ".phase-marker.svelte-1t4xap{grid-column:3;background:#555;border:1px solid #888;color:#eee;text-align:center;font-weight:bold;padding-top:10px;padding-bottom:10px;text-orientation:sideways;writing-mode:vertical-rl;line-height:30px;width:100%}";
	append(document.head, style);
}

function create_fragment$a(ctx) {
	let div;
	let t_value = (/*phase*/ ctx[0] || "") + "";
	let t;

	return {
		c() {
			div = element("div");
			t = text(t_value);
			attr(div, "class", "phase-marker svelte-1t4xap");
			attr(div, "style", /*style*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, [dirty]) {
			if (dirty & /*phase*/ 1 && t_value !== (t_value = (/*phase*/ ctx[0] || "") + "")) set_data(t, t_value);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function instance$a($$self, $$props, $$invalidate) {
	let { phase } = $$props;
	let { numEvents } = $$props;
	const style = `grid-row: span ${numEvents}`;

	$$self.$set = $$props => {
		if ("phase" in $$props) $$invalidate(0, phase = $$props.phase);
		if ("numEvents" in $$props) $$invalidate(2, numEvents = $$props.numEvents);
	};

	return [phase, style, numEvents];
}

class PhaseMarker extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1t4xap-style")) add_css$a();
		init(this, options, instance$a, create_fragment$a, safe_not_equal, { phase: 0, numEvents: 2 });
	}
}

/* src/client/debug/log/CustomPayload.svelte generated by Svelte v3.20.1 */

function create_fragment$b(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = `${/*custompayload*/ ctx[0]}`;
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function instance$b($$self, $$props, $$invalidate) {
	let { payload } = $$props;

	const custompayload = payload !== undefined
	? JSON.stringify(payload, null, 4)
	: "";

	$$self.$set = $$props => {
		if ("payload" in $$props) $$invalidate(1, payload = $$props.payload);
	};

	return [custompayload, payload];
}

class CustomPayload extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$b, create_fragment$b, safe_not_equal, { payload: 1 });
	}
}

/* src/client/debug/log/LogEvent.svelte generated by Svelte v3.20.1 */

function add_css$b() {
	var style = element("style");
	style.id = "svelte-10wdo7v-style";
	style.textContent = ".log-event.svelte-10wdo7v{grid-column:2;cursor:pointer;overflow:hidden;display:flex;flex-direction:column;justify-content:center;background:#fff;border:1px dotted #ccc;border-left:5px solid #ccc;padding:5px;text-align:center;color:#888;font-size:14px;min-height:25px;line-height:25px}.log-event.svelte-10wdo7v:hover{border-style:solid;background:#eee}.log-event.pinned.svelte-10wdo7v{border-style:solid;background:#eee;opacity:1}.player0.svelte-10wdo7v{border-left-color:#ff851b}.player1.svelte-10wdo7v{border-left-color:#7fdbff}.player2.svelte-10wdo7v{border-left-color:#0074d9}.player3.svelte-10wdo7v{border-left-color:#39cccc}.player4.svelte-10wdo7v{border-left-color:#3d9970}.player5.svelte-10wdo7v{border-left-color:#2ecc40}.player6.svelte-10wdo7v{border-left-color:#01ff70}.player7.svelte-10wdo7v{border-left-color:#ffdc00}.player8.svelte-10wdo7v{border-left-color:#001f3f}.player9.svelte-10wdo7v{border-left-color:#ff4136}.player10.svelte-10wdo7v{border-left-color:#85144b}.player11.svelte-10wdo7v{border-left-color:#f012be}.player12.svelte-10wdo7v{border-left-color:#b10dc9}.player13.svelte-10wdo7v{border-left-color:#111111}.player14.svelte-10wdo7v{border-left-color:#aaaaaa}.player15.svelte-10wdo7v{border-left-color:#dddddd}";
	append(document.head, style);
}

// (122:2) {:else}
function create_else_block(ctx) {
	let current;
	const custompayload = new CustomPayload({ props: { payload: /*payload*/ ctx[3] } });

	return {
		c() {
			create_component(custompayload.$$.fragment);
		},
		m(target, anchor) {
			mount_component(custompayload, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const custompayload_changes = {};
			if (dirty & /*payload*/ 8) custompayload_changes.payload = /*payload*/ ctx[3];
			custompayload.$set(custompayload_changes);
		},
		i(local) {
			if (current) return;
			transition_in(custompayload.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(custompayload.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(custompayload, detaching);
		}
	};
}

// (120:2) {#if payloadComponent}
function create_if_block$4(ctx) {
	let switch_instance_anchor;
	let current;
	var switch_value = /*payloadComponent*/ ctx[4];

	function switch_props(ctx) {
		return { props: { payload: /*payload*/ ctx[3] } };
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));
	}

	return {
		c() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert(target, switch_instance_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const switch_instance_changes = {};
			if (dirty & /*payload*/ 8) switch_instance_changes.payload = /*payload*/ ctx[3];

			if (switch_value !== (switch_value = /*payloadComponent*/ ctx[4])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};
}

function create_fragment$c(ctx) {
	let div1;
	let div0;
	let t0_value = /*action*/ ctx[1].payload.type + "";
	let t0;
	let t1;
	let t2_value = /*args*/ ctx[6].join(",") + "";
	let t2;
	let t3;
	let t4;
	let current_block_type_index;
	let if_block;
	let div1_class_value;
	let current;
	let dispose;
	const if_block_creators = [create_if_block$4, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*payloadComponent*/ ctx[4]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = text("(");
			t2 = text(t2_value);
			t3 = text(")");
			t4 = space();
			if_block.c();
			attr(div1, "class", div1_class_value = "log-event player" + /*playerID*/ ctx[7] + " svelte-10wdo7v");
			toggle_class(div1, "pinned", /*pinned*/ ctx[2]);
		},
		m(target, anchor, remount) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			append(div0, t3);
			append(div1, t4);
			if_blocks[current_block_type_index].m(div1, null);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen(div1, "click", /*click_handler*/ ctx[8]),
				listen(div1, "mouseenter", /*mouseenter_handler*/ ctx[9]),
				listen(div1, "mouseleave", /*mouseleave_handler*/ ctx[10])
			];
		},
		p(ctx, [dirty]) {
			if ((!current || dirty & /*action*/ 2) && t0_value !== (t0_value = /*action*/ ctx[1].payload.type + "")) set_data(t0, t0_value);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(div1, null);
			}

			if (dirty & /*pinned*/ 4) {
				toggle_class(div1, "pinned", /*pinned*/ ctx[2]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			if_blocks[current_block_type_index].d();
			run_all(dispose);
		}
	};
}

function instance$c($$self, $$props, $$invalidate) {
	let { logIndex } = $$props;
	let { action } = $$props;
	let { pinned } = $$props;
	let { payload } = $$props;
	let { payloadComponent } = $$props;
	const dispatch = createEventDispatcher();
	const args = action.payload.args || [];
	const playerID = action.payload.playerID;
	const click_handler = () => dispatch("click", { logIndex });
	const mouseenter_handler = () => dispatch("mouseenter", { logIndex });
	const mouseleave_handler = () => dispatch("mouseleave");

	$$self.$set = $$props => {
		if ("logIndex" in $$props) $$invalidate(0, logIndex = $$props.logIndex);
		if ("action" in $$props) $$invalidate(1, action = $$props.action);
		if ("pinned" in $$props) $$invalidate(2, pinned = $$props.pinned);
		if ("payload" in $$props) $$invalidate(3, payload = $$props.payload);
		if ("payloadComponent" in $$props) $$invalidate(4, payloadComponent = $$props.payloadComponent);
	};

	return [
		logIndex,
		action,
		pinned,
		payload,
		payloadComponent,
		dispatch,
		args,
		playerID,
		click_handler,
		mouseenter_handler,
		mouseleave_handler
	];
}

class LogEvent extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-10wdo7v-style")) add_css$b();

		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
			logIndex: 0,
			action: 1,
			pinned: 2,
			payload: 3,
			payloadComponent: 4
		});
	}
}

/* node_modules/svelte-icons/components/IconBase.svelte generated by Svelte v3.20.1 */

function add_css$c() {
	var style = element("style");
	style.id = "svelte-c8tyih-style";
	style.textContent = "svg.svelte-c8tyih{stroke:currentColor;fill:currentColor;stroke-width:0;width:100%;height:auto;max-height:100%}";
	append(document.head, style);
}

// (18:2) {#if title}
function create_if_block$5(ctx) {
	let title_1;
	let t;

	return {
		c() {
			title_1 = svg_element("title");
			t = text(/*title*/ ctx[0]);
		},
		m(target, anchor) {
			insert(target, title_1, anchor);
			append(title_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*title*/ 1) set_data(t, /*title*/ ctx[0]);
		},
		d(detaching) {
			if (detaching) detach(title_1);
		}
	};
}

function create_fragment$d(ctx) {
	let svg;
	let if_block_anchor;
	let current;
	let if_block = /*title*/ ctx[0] && create_if_block$5(ctx);
	const default_slot_template = /*$$slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	return {
		c() {
			svg = svg_element("svg");
			if (if_block) if_block.c();
			if_block_anchor = empty();
			if (default_slot) default_slot.c();
			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr(svg, "viewBox", /*viewBox*/ ctx[1]);
			attr(svg, "class", "svelte-c8tyih");
		},
		m(target, anchor) {
			insert(target, svg, anchor);
			if (if_block) if_block.m(svg, null);
			append(svg, if_block_anchor);

			if (default_slot) {
				default_slot.m(svg, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (/*title*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$5(ctx);
					if_block.c();
					if_block.m(svg, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 4) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
				}
			}

			if (!current || dirty & /*viewBox*/ 2) {
				attr(svg, "viewBox", /*viewBox*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(svg);
			if (if_block) if_block.d();
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance$d($$self, $$props, $$invalidate) {
	let { title = null } = $$props;
	let { viewBox } = $$props;
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("title" in $$props) $$invalidate(0, title = $$props.title);
		if ("viewBox" in $$props) $$invalidate(1, viewBox = $$props.viewBox);
		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [title, viewBox, $$scope, $$slots];
}

class IconBase extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-c8tyih-style")) add_css$c();
		init(this, options, instance$d, create_fragment$d, safe_not_equal, { title: 0, viewBox: 1 });
	}
}

/* node_modules/svelte-icons/fa/FaArrowAltCircleDown.svelte generated by Svelte v3.20.1 */

function create_default_slot(ctx) {
	let path;

	return {
		c() {
			path = svg_element("path");
			attr(path, "d", "M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM212 140v116h-70.9c-10.7 0-16.1 13-8.5 20.5l114.9 114.3c4.7 4.7 12.2 4.7 16.9 0l114.9-114.3c7.6-7.6 2.2-20.5-8.5-20.5H300V140c0-6.6-5.4-12-12-12h-64c-6.6 0-12 5.4-12 12z");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function create_fragment$e(ctx) {
	let current;
	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

	let iconbase_props = {
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
	}

	const iconbase = new IconBase({ props: iconbase_props });

	return {
		c() {
			create_component(iconbase.$$.fragment);
		},
		m(target, anchor) {
			mount_component(iconbase, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const iconbase_changes = (dirty & /*$$props*/ 1)
			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
			: {};

			if (dirty & /*$$scope*/ 2) {
				iconbase_changes.$$scope = { dirty, ctx };
			}

			iconbase.$set(iconbase_changes);
		},
		i(local) {
			if (current) return;
			transition_in(iconbase.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(iconbase.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(iconbase, detaching);
		}
	};
}

function instance$e($$self, $$props, $$invalidate) {
	$$self.$set = $$new_props => {
		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
	};

	$$props = exclude_internal_props($$props);
	return [$$props];
}

class FaArrowAltCircleDown extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});
	}
}

/* src/client/debug/mcts/Action.svelte generated by Svelte v3.20.1 */

function add_css$d() {
	var style = element("style");
	style.id = "svelte-1a7time-style";
	style.textContent = "div.svelte-1a7time{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:500px}";
	append(document.head, style);
}

function create_fragment$f(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*text*/ ctx[0]);
			attr(div, "alt", /*text*/ ctx[0]);
			attr(div, "class", "svelte-1a7time");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, [dirty]) {
			if (dirty & /*text*/ 1) set_data(t, /*text*/ ctx[0]);

			if (dirty & /*text*/ 1) {
				attr(div, "alt", /*text*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function instance$f($$self, $$props, $$invalidate) {
	let { action } = $$props;
	let text;

	$$self.$set = $$props => {
		if ("action" in $$props) $$invalidate(1, action = $$props.action);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*action*/ 2) {
			 {
				const { type, args } = action.payload;
				const argsFormatted = (args || []).join(",");
				$$invalidate(0, text = `${type}(${argsFormatted})`);
			}
		}
	};

	return [text, action];
}

class Action extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1a7time-style")) add_css$d();
		init(this, options, instance$f, create_fragment$f, safe_not_equal, { action: 1 });
	}
}

/* src/client/debug/mcts/Table.svelte generated by Svelte v3.20.1 */

function add_css$e() {
	var style = element("style");
	style.id = "svelte-ztcwsu-style";
	style.textContent = "table.svelte-ztcwsu.svelte-ztcwsu{font-size:12px;border-collapse:collapse;border:1px solid #ddd;padding:0}tr.svelte-ztcwsu.svelte-ztcwsu{cursor:pointer}tr.svelte-ztcwsu:hover td.svelte-ztcwsu{background:#eee}tr.selected.svelte-ztcwsu td.svelte-ztcwsu{background:#eee}td.svelte-ztcwsu.svelte-ztcwsu{padding:10px;height:10px;line-height:10px;font-size:12px;border:none}th.svelte-ztcwsu.svelte-ztcwsu{background:#888;color:#fff;padding:10px;text-align:center}";
	append(document.head, style);
}

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	child_ctx[12] = i;
	return child_ctx;
}

// (86:2) {#each children as child, i}
function create_each_block$3(ctx) {
	let tr;
	let td0;
	let t0_value = /*child*/ ctx[10].value + "";
	let t0;
	let t1;
	let td1;
	let t2_value = /*child*/ ctx[10].visits + "";
	let t2;
	let t3;
	let td2;
	let t4;
	let current;
	let dispose;

	const action = new Action({
			props: { action: /*child*/ ctx[10].parentAction }
		});

	function click_handler(...args) {
		return /*click_handler*/ ctx[7](/*child*/ ctx[10], /*i*/ ctx[12], ...args);
	}

	function mouseout_handler(...args) {
		return /*mouseout_handler*/ ctx[8](/*i*/ ctx[12], ...args);
	}

	function mouseover_handler(...args) {
		return /*mouseover_handler*/ ctx[9](/*child*/ ctx[10], /*i*/ ctx[12], ...args);
	}

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td2 = element("td");
			create_component(action.$$.fragment);
			t4 = space();
			attr(td0, "class", "svelte-ztcwsu");
			attr(td1, "class", "svelte-ztcwsu");
			attr(td2, "class", "svelte-ztcwsu");
			attr(tr, "class", "svelte-ztcwsu");
			toggle_class(tr, "clickable", /*children*/ ctx[1].length > 0);
			toggle_class(tr, "selected", /*i*/ ctx[12] === /*selectedIndex*/ ctx[0]);
		},
		m(target, anchor, remount) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, t0);
			append(tr, t1);
			append(tr, td1);
			append(td1, t2);
			append(tr, t3);
			append(tr, td2);
			mount_component(action, td2, null);
			append(tr, t4);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen(tr, "click", click_handler),
				listen(tr, "mouseout", mouseout_handler),
				listen(tr, "mouseover", mouseover_handler)
			];
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if ((!current || dirty & /*children*/ 2) && t0_value !== (t0_value = /*child*/ ctx[10].value + "")) set_data(t0, t0_value);
			if ((!current || dirty & /*children*/ 2) && t2_value !== (t2_value = /*child*/ ctx[10].visits + "")) set_data(t2, t2_value);
			const action_changes = {};
			if (dirty & /*children*/ 2) action_changes.action = /*child*/ ctx[10].parentAction;
			action.$set(action_changes);

			if (dirty & /*children*/ 2) {
				toggle_class(tr, "clickable", /*children*/ ctx[1].length > 0);
			}

			if (dirty & /*selectedIndex*/ 1) {
				toggle_class(tr, "selected", /*i*/ ctx[12] === /*selectedIndex*/ ctx[0]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(action.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(action.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(tr);
			destroy_component(action);
			run_all(dispose);
		}
	};
}

function create_fragment$g(ctx) {
	let table;
	let thead;
	let t5;
	let tbody;
	let current;
	let each_value = /*children*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			table = element("table");
			thead = element("thead");

			thead.innerHTML = `<th class="svelte-ztcwsu">Value</th> 
    <th class="svelte-ztcwsu">Visits</th> 
    <th class="svelte-ztcwsu">Action</th>`;

			t5 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(table, "class", "svelte-ztcwsu");
		},
		m(target, anchor) {
			insert(target, table, anchor);
			append(table, thead);
			append(table, t5);
			append(table, tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*children, selectedIndex, Select, Preview*/ 15) {
				each_value = /*children*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(tbody, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(table);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$g($$self, $$props, $$invalidate) {
	let { root } = $$props;
	let { selectedIndex = null } = $$props;
	const dispatch = createEventDispatcher();
	let parents = [];
	let children = [];

	function Select(node, i) {
		dispatch("select", { node, selectedIndex: i });
	}

	function Preview(node, i) {
		if (selectedIndex === null) {
			dispatch("preview", { node });
		}
	}

	const click_handler = (child, i) => Select(child, i);
	const mouseout_handler = i => Preview(null);
	const mouseover_handler = (child, i) => Preview(child);

	$$self.$set = $$props => {
		if ("root" in $$props) $$invalidate(4, root = $$props.root);
		if ("selectedIndex" in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*root, parents*/ 48) {
			 {
				let t = root;
				$$invalidate(5, parents = []);

				while (t.parent) {
					const parent = t.parent;
					const { type, args } = t.parentAction.payload;
					const argsFormatted = (args || []).join(",");
					const arrowText = `${type}(${argsFormatted})`;
					parents.push({ parent, arrowText });
					t = parent;
				}

				parents.reverse();
				$$invalidate(1, children = [...root.children].sort((a, b) => a.visits < b.visits ? 1 : -1).slice(0, 50));
			}
		}
	};

	return [
		selectedIndex,
		children,
		Select,
		Preview,
		root,
		parents,
		dispatch,
		click_handler,
		mouseout_handler,
		mouseover_handler
	];
}

class Table extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-ztcwsu-style")) add_css$e();
		init(this, options, instance$g, create_fragment$g, safe_not_equal, { root: 4, selectedIndex: 0 });
	}
}

/* src/client/debug/mcts/MCTS.svelte generated by Svelte v3.20.1 */

function add_css$f() {
	var style = element("style");
	style.id = "svelte-1f0amz4-style";
	style.textContent = ".visualizer.svelte-1f0amz4{display:flex;flex-direction:column;align-items:center;padding:50px}.preview.svelte-1f0amz4{opacity:0.5}.icon.svelte-1f0amz4{color:#777;width:32px;height:32px;margin-bottom:20px}";
	append(document.head, style);
}

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i].node;
	child_ctx[10] = list[i].selectedIndex;
	child_ctx[12] = i;
	return child_ctx;
}

// (50:4) {#if i !== 0}
function create_if_block_2$1(ctx) {
	let div;
	let current;
	const arrow = new FaArrowAltCircleDown({});

	return {
		c() {
			div = element("div");
			create_component(arrow.$$.fragment);
			attr(div, "class", "icon svelte-1f0amz4");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(arrow, div, null);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(arrow.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(arrow.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(arrow);
		}
	};
}

// (61:6) {:else}
function create_else_block$1(ctx) {
	let current;

	function select_handler_1(...args) {
		return /*select_handler_1*/ ctx[8](/*i*/ ctx[12], ...args);
	}

	const table = new Table({
			props: {
				root: /*node*/ ctx[9],
				selectedIndex: /*selectedIndex*/ ctx[10]
			}
		});

	table.$on("select", select_handler_1);

	return {
		c() {
			create_component(table.$$.fragment);
		},
		m(target, anchor) {
			mount_component(table, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const table_changes = {};
			if (dirty & /*nodes*/ 1) table_changes.root = /*node*/ ctx[9];
			if (dirty & /*nodes*/ 1) table_changes.selectedIndex = /*selectedIndex*/ ctx[10];
			table.$set(table_changes);
		},
		i(local) {
			if (current) return;
			transition_in(table.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(table.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(table, detaching);
		}
	};
}

// (57:6) {#if i === nodes.length - 1}
function create_if_block_1$1(ctx) {
	let current;

	function select_handler(...args) {
		return /*select_handler*/ ctx[6](/*i*/ ctx[12], ...args);
	}

	function preview_handler(...args) {
		return /*preview_handler*/ ctx[7](/*i*/ ctx[12], ...args);
	}

	const table = new Table({ props: { root: /*node*/ ctx[9] } });
	table.$on("select", select_handler);
	table.$on("preview", preview_handler);

	return {
		c() {
			create_component(table.$$.fragment);
		},
		m(target, anchor) {
			mount_component(table, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const table_changes = {};
			if (dirty & /*nodes*/ 1) table_changes.root = /*node*/ ctx[9];
			table.$set(table_changes);
		},
		i(local) {
			if (current) return;
			transition_in(table.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(table.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(table, detaching);
		}
	};
}

// (49:2) {#each nodes as { node, selectedIndex }
function create_each_block$4(ctx) {
	let t;
	let section;
	let current_block_type_index;
	let if_block1;
	let current;
	let if_block0 = /*i*/ ctx[12] !== 0 && create_if_block_2$1();
	const if_block_creators = [create_if_block_1$1, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*i*/ ctx[12] === /*nodes*/ ctx[0].length - 1) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t = space();
			section = element("section");
			if_block1.c();
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t, anchor);
			insert(target, section, anchor);
			if_blocks[current_block_type_index].m(section, null);
			current = true;
		},
		p(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block1 = if_blocks[current_block_type_index];

				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				}

				transition_in(if_block1, 1);
				if_block1.m(section, null);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			current = false;
		},
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t);
			if (detaching) detach(section);
			if_blocks[current_block_type_index].d();
		}
	};
}

// (69:2) {#if preview}
function create_if_block$6(ctx) {
	let div;
	let t;
	let section;
	let current;
	const arrow = new FaArrowAltCircleDown({});
	const table = new Table({ props: { root: /*preview*/ ctx[1] } });

	return {
		c() {
			div = element("div");
			create_component(arrow.$$.fragment);
			t = space();
			section = element("section");
			create_component(table.$$.fragment);
			attr(div, "class", "icon svelte-1f0amz4");
			attr(section, "class", "preview svelte-1f0amz4");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(arrow, div, null);
			insert(target, t, anchor);
			insert(target, section, anchor);
			mount_component(table, section, null);
			current = true;
		},
		p(ctx, dirty) {
			const table_changes = {};
			if (dirty & /*preview*/ 2) table_changes.root = /*preview*/ ctx[1];
			table.$set(table_changes);
		},
		i(local) {
			if (current) return;
			transition_in(arrow.$$.fragment, local);
			transition_in(table.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(arrow.$$.fragment, local);
			transition_out(table.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(arrow);
			if (detaching) detach(t);
			if (detaching) detach(section);
			destroy_component(table);
		}
	};
}

function create_fragment$h(ctx) {
	let div;
	let t;
	let current;
	let each_value = /*nodes*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	let if_block = /*preview*/ ctx[1] && create_if_block$6(ctx);

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			if (if_block) if_block.c();
			attr(div, "class", "visualizer svelte-1f0amz4");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append(div, t);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*nodes, SelectNode, PreviewNode*/ 13) {
				each_value = /*nodes*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, t);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (/*preview*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(if_block);
			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
			if (if_block) if_block.d();
		}
	};
}

function instance$h($$self, $$props, $$invalidate) {
	let { metadata } = $$props;
	let nodes = [];
	let prevNodes = [];
	let preview = null;

	function SelectNode({ node, selectedIndex }, i) {
		$$invalidate(1, preview = null);
		$$invalidate(0, nodes[i].selectedIndex = selectedIndex, nodes);
		$$invalidate(0, nodes = [...nodes.slice(0, i + 1), { node }]);
	}

	function PreviewNode({ node }, i) {
		$$invalidate(1, preview = node);
	}

	const select_handler = (i, e) => SelectNode(e.detail, i);
	const preview_handler = (i, e) => PreviewNode(e.detail);
	const select_handler_1 = (i, e) => SelectNode(e.detail, i);

	$$self.$set = $$props => {
		if ("metadata" in $$props) $$invalidate(4, metadata = $$props.metadata);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*metadata*/ 16) {
			 {
				prevNodes = [];
				$$invalidate(0, nodes = [{ node: metadata }]);
			}
		}
	};

	return [
		nodes,
		preview,
		SelectNode,
		PreviewNode,
		metadata,
		prevNodes,
		select_handler,
		preview_handler,
		select_handler_1
	];
}

class MCTS extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1f0amz4-style")) add_css$f();
		init(this, options, instance$h, create_fragment$h, safe_not_equal, { metadata: 4 });
	}
}

/* src/client/debug/log/Log.svelte generated by Svelte v3.20.1 */

function add_css$g() {
	var style = element("style");
	style.id = "svelte-1pq5e4b-style";
	style.textContent = ".gamelog.svelte-1pq5e4b{display:grid;grid-template-columns:30px 1fr 30px;grid-auto-rows:auto;grid-auto-flow:column}";
	append(document.head, style);
}

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i].phase;
	child_ctx[17] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[18] = list[i].action;
	child_ctx[19] = list[i].payload;
	child_ctx[17] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[21] = list[i].turn;
	child_ctx[17] = i;
	return child_ctx;
}

// (137:4) {#if i in turnBoundaries}
function create_if_block_1$2(ctx) {
	let current;

	const turnmarker = new TurnMarker({
			props: {
				turn: /*turn*/ ctx[21],
				numEvents: /*turnBoundaries*/ ctx[3][/*i*/ ctx[17]]
			}
		});

	return {
		c() {
			create_component(turnmarker.$$.fragment);
		},
		m(target, anchor) {
			mount_component(turnmarker, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const turnmarker_changes = {};
			if (dirty & /*renderedLogEntries*/ 4) turnmarker_changes.turn = /*turn*/ ctx[21];
			if (dirty & /*turnBoundaries*/ 8) turnmarker_changes.numEvents = /*turnBoundaries*/ ctx[3][/*i*/ ctx[17]];
			turnmarker.$set(turnmarker_changes);
		},
		i(local) {
			if (current) return;
			transition_in(turnmarker.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(turnmarker.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(turnmarker, detaching);
		}
	};
}

// (136:2) {#each renderedLogEntries as { turn }
function create_each_block_2(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*i*/ ctx[17] in /*turnBoundaries*/ ctx[3] && create_if_block_1$2(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (/*i*/ ctx[17] in /*turnBoundaries*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block_1$2(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (142:2) {#each renderedLogEntries as { action, payload }
function create_each_block_1(ctx) {
	let current;

	const logevent = new LogEvent({
			props: {
				pinned: /*i*/ ctx[17] === /*pinned*/ ctx[1],
				logIndex: /*i*/ ctx[17],
				action: /*action*/ ctx[18],
				payload: /*payload*/ ctx[19]
			}
		});

	logevent.$on("click", /*OnLogClick*/ ctx[5]);
	logevent.$on("mouseenter", /*OnMouseEnter*/ ctx[6]);
	logevent.$on("mouseleave", /*OnMouseLeave*/ ctx[7]);

	return {
		c() {
			create_component(logevent.$$.fragment);
		},
		m(target, anchor) {
			mount_component(logevent, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const logevent_changes = {};
			if (dirty & /*pinned*/ 2) logevent_changes.pinned = /*i*/ ctx[17] === /*pinned*/ ctx[1];
			if (dirty & /*renderedLogEntries*/ 4) logevent_changes.action = /*action*/ ctx[18];
			if (dirty & /*renderedLogEntries*/ 4) logevent_changes.payload = /*payload*/ ctx[19];
			logevent.$set(logevent_changes);
		},
		i(local) {
			if (current) return;
			transition_in(logevent.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(logevent.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(logevent, detaching);
		}
	};
}

// (154:4) {#if i in phaseBoundaries}
function create_if_block$7(ctx) {
	let current;

	const phasemarker = new PhaseMarker({
			props: {
				phase: /*phase*/ ctx[15],
				numEvents: /*phaseBoundaries*/ ctx[4][/*i*/ ctx[17]]
			}
		});

	return {
		c() {
			create_component(phasemarker.$$.fragment);
		},
		m(target, anchor) {
			mount_component(phasemarker, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const phasemarker_changes = {};
			if (dirty & /*renderedLogEntries*/ 4) phasemarker_changes.phase = /*phase*/ ctx[15];
			if (dirty & /*phaseBoundaries*/ 16) phasemarker_changes.numEvents = /*phaseBoundaries*/ ctx[4][/*i*/ ctx[17]];
			phasemarker.$set(phasemarker_changes);
		},
		i(local) {
			if (current) return;
			transition_in(phasemarker.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(phasemarker.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(phasemarker, detaching);
		}
	};
}

// (153:2) {#each renderedLogEntries as { phase }
function create_each_block$5(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*i*/ ctx[17] in /*phaseBoundaries*/ ctx[4] && create_if_block$7(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (/*i*/ ctx[17] in /*phaseBoundaries*/ ctx[4]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$7(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function create_fragment$i(ctx) {
	let div;
	let t0;
	let t1;
	let current;
	let dispose;
	let each_value_2 = /*renderedLogEntries*/ ctx[2];
	let each_blocks_2 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
		each_blocks_2[i] = null;
	});

	let each_value_1 = /*renderedLogEntries*/ ctx[2];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
		each_blocks_1[i] = null;
	});

	let each_value = /*renderedLogEntries*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	const out_2 = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t0 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "gamelog svelte-1pq5e4b");
			toggle_class(div, "pinned", /*pinned*/ ctx[1]);
		},
		m(target, anchor, remount) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].m(div, null);
			}

			append(div, t0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div, null);
			}

			append(div, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
			if (remount) dispose();
			dispose = listen(window, "keydown", /*OnKeyDown*/ ctx[8]);
		},
		p(ctx, [dirty]) {
			if (dirty & /*renderedLogEntries, turnBoundaries*/ 12) {
				each_value_2 = /*renderedLogEntries*/ ctx[2];
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks_2[i]) {
						each_blocks_2[i].p(child_ctx, dirty);
						transition_in(each_blocks_2[i], 1);
					} else {
						each_blocks_2[i] = create_each_block_2(child_ctx);
						each_blocks_2[i].c();
						transition_in(each_blocks_2[i], 1);
						each_blocks_2[i].m(div, t0);
					}
				}

				group_outros();

				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (dirty & /*pinned, renderedLogEntries, OnLogClick, OnMouseEnter, OnMouseLeave*/ 230) {
				each_value_1 = /*renderedLogEntries*/ ctx[2];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
						transition_in(each_blocks_1[i], 1);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						transition_in(each_blocks_1[i], 1);
						each_blocks_1[i].m(div, t1);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
					out_1(i);
				}

				check_outros();
			}

			if (dirty & /*renderedLogEntries, phaseBoundaries*/ 20) {
				each_value = /*renderedLogEntries*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out_2(i);
				}

				check_outros();
			}

			if (dirty & /*pinned*/ 2) {
				toggle_class(div, "pinned", /*pinned*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_2.length; i += 1) {
				transition_in(each_blocks_2[i]);
			}

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks_1[i]);
			}

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks_2 = each_blocks_2.filter(Boolean);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				transition_out(each_blocks_2[i]);
			}

			each_blocks_1 = each_blocks_1.filter(Boolean);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				transition_out(each_blocks_1[i]);
			}

			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks_2, detaching);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			dispose();
		}
	};
}

function instance$i($$self, $$props, $$invalidate) {
	let $client,
		$$unsubscribe_client = noop,
		$$subscribe_client = () => ($$unsubscribe_client(), $$unsubscribe_client = subscribe(client, $$value => $$invalidate(10, $client = $$value)), client);

	$$self.$$.on_destroy.push(() => $$unsubscribe_client());
	let { client } = $$props;
	$$subscribe_client();
	const { secondaryPane } = getContext("secondaryPane");
	const initialState = client.getInitialState();
	let { log } = $client;
	let pinned = null;

	function rewind(logIndex) {
		let state = initialState;

		for (let i = 0; i < log.length; i++) {
			const { action, automatic } = log[i];

			if (!automatic) {
				state = client.reducer(state, action);
			}

			if (action.type == MAKE_MOVE) {
				if (logIndex == 0) {
					break;
				}

				logIndex--;
			}
		}

		return { G: state.G, ctx: state.ctx };
	}

	function OnLogClick(e) {
		const { logIndex } = e.detail;
		const state = rewind(logIndex);
		const renderedLogEntries = log.filter(e => e.action.type == MAKE_MOVE);
		client.overrideGameState(state);

		if (pinned == logIndex) {
			$$invalidate(1, pinned = null);
			secondaryPane.set(null);
		} else {
			$$invalidate(1, pinned = logIndex);
			const { metadata } = renderedLogEntries[logIndex].action.payload;

			if (metadata) {
				secondaryPane.set({ component: MCTS, metadata });
			}
		}
	}

	function OnMouseEnter(e) {
		const { logIndex } = e.detail;

		if (pinned === null) {
			const state = rewind(logIndex);
			client.overrideGameState(state);
		}
	}

	function OnMouseLeave() {
		if (pinned === null) {
			client.overrideGameState(null);
		}
	}

	function Reset() {
		$$invalidate(1, pinned = null);
		client.overrideGameState(null);
		secondaryPane.set(null);
	}

	onDestroy(Reset);

	function OnKeyDown(e) {
		// ESC.
		if (e.keyCode == 27) {
			Reset();
		}
	}

	let renderedLogEntries;
	let turnBoundaries = {};
	let phaseBoundaries = {};

	$$self.$set = $$props => {
		if ("client" in $$props) $$subscribe_client($$invalidate(0, client = $$props.client));
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$client, log, renderedLogEntries*/ 1540) {
			 {
				$$invalidate(9, log = $client.log);
				$$invalidate(2, renderedLogEntries = log.filter(e => e.action.type == MAKE_MOVE));
				let eventsInCurrentPhase = 0;
				let eventsInCurrentTurn = 0;
				$$invalidate(3, turnBoundaries = {});
				$$invalidate(4, phaseBoundaries = {});

				for (let i = 0; i < renderedLogEntries.length; i++) {
					const { action, payload, turn, phase } = renderedLogEntries[i];
					eventsInCurrentTurn++;
					eventsInCurrentPhase++;

					if (i == renderedLogEntries.length - 1 || renderedLogEntries[i + 1].turn != turn) {
						$$invalidate(3, turnBoundaries[i] = eventsInCurrentTurn, turnBoundaries);
						eventsInCurrentTurn = 0;
					}

					if (i == renderedLogEntries.length - 1 || renderedLogEntries[i + 1].phase != phase) {
						$$invalidate(4, phaseBoundaries[i] = eventsInCurrentPhase, phaseBoundaries);
						eventsInCurrentPhase = 0;
					}
				}
			}
		}
	};

	return [
		client,
		pinned,
		renderedLogEntries,
		turnBoundaries,
		phaseBoundaries,
		OnLogClick,
		OnMouseEnter,
		OnMouseLeave,
		OnKeyDown
	];
}

class Log extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1pq5e4b-style")) add_css$g();
		init(this, options, instance$i, create_fragment$i, safe_not_equal, { client: 0 });
	}
}

/* src/client/debug/ai/Options.svelte generated by Svelte v3.20.1 */

function add_css$h() {
	var style = element("style");
	style.id = "svelte-7cel4i-style";
	style.textContent = "label.svelte-7cel4i{font-weight:bold;color:#999}.option.svelte-7cel4i{margin-bottom:20px}.value.svelte-7cel4i{font-weight:bold}input[type='checkbox'].svelte-7cel4i{vertical-align:middle}";
	append(document.head, style);
}

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i][0];
	child_ctx[6] = list[i][1];
	return child_ctx;
}

// (39:4) {#if value.range}
function create_if_block_1$3(ctx) {
	let span;
	let t0_value = /*values*/ ctx[1][/*key*/ ctx[5]] + "";
	let t0;
	let t1;
	let input;
	let input_min_value;
	let input_max_value;
	let dispose;

	function input_change_input_handler() {
		/*input_change_input_handler*/ ctx[3].call(input, /*key*/ ctx[5]);
	}

	return {
		c() {
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			input = element("input");
			attr(span, "class", "value svelte-7cel4i");
			attr(input, "type", "range");
			attr(input, "min", input_min_value = /*value*/ ctx[6].range.min);
			attr(input, "max", input_max_value = /*value*/ ctx[6].range.max);
		},
		m(target, anchor, remount) {
			insert(target, span, anchor);
			append(span, t0);
			insert(target, t1, anchor);
			insert(target, input, anchor);
			set_input_value(input, /*values*/ ctx[1][/*key*/ ctx[5]]);
			if (remount) run_all(dispose);

			dispose = [
				listen(input, "change", input_change_input_handler),
				listen(input, "input", input_change_input_handler),
				listen(input, "change", /*OnChange*/ ctx[2])
			];
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*values, bot*/ 3 && t0_value !== (t0_value = /*values*/ ctx[1][/*key*/ ctx[5]] + "")) set_data(t0, t0_value);

			if (dirty & /*bot*/ 1 && input_min_value !== (input_min_value = /*value*/ ctx[6].range.min)) {
				attr(input, "min", input_min_value);
			}

			if (dirty & /*bot*/ 1 && input_max_value !== (input_max_value = /*value*/ ctx[6].range.max)) {
				attr(input, "max", input_max_value);
			}

			if (dirty & /*values, Object, bot*/ 3) {
				set_input_value(input, /*values*/ ctx[1][/*key*/ ctx[5]]);
			}
		},
		d(detaching) {
			if (detaching) detach(span);
			if (detaching) detach(t1);
			if (detaching) detach(input);
			run_all(dispose);
		}
	};
}

// (44:4) {#if typeof value.value === 'boolean'}
function create_if_block$8(ctx) {
	let input;
	let dispose;

	function input_change_handler() {
		/*input_change_handler*/ ctx[4].call(input, /*key*/ ctx[5]);
	}

	return {
		c() {
			input = element("input");
			attr(input, "type", "checkbox");
			attr(input, "class", "svelte-7cel4i");
		},
		m(target, anchor, remount) {
			insert(target, input, anchor);
			input.checked = /*values*/ ctx[1][/*key*/ ctx[5]];
			if (remount) run_all(dispose);

			dispose = [
				listen(input, "change", input_change_handler),
				listen(input, "change", /*OnChange*/ ctx[2])
			];
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*values, Object, bot*/ 3) {
				input.checked = /*values*/ ctx[1][/*key*/ ctx[5]];
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			run_all(dispose);
		}
	};
}

// (35:0) {#each Object.entries(bot.opts()) as [key, value]}
function create_each_block$6(ctx) {
	let div;
	let label;
	let t0_value = /*key*/ ctx[5] + "";
	let t0;
	let t1;
	let t2;
	let t3;
	let if_block0 = /*value*/ ctx[6].range && create_if_block_1$3(ctx);
	let if_block1 = typeof /*value*/ ctx[6].value === "boolean" && create_if_block$8(ctx);

	return {
		c() {
			div = element("div");
			label = element("label");
			t0 = text(t0_value);
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			t3 = space();
			attr(label, "class", "svelte-7cel4i");
			attr(div, "class", "option svelte-7cel4i");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, label);
			append(label, t0);
			append(div, t1);
			if (if_block0) if_block0.m(div, null);
			append(div, t2);
			if (if_block1) if_block1.m(div, null);
			append(div, t3);
		},
		p(ctx, dirty) {
			if (dirty & /*bot*/ 1 && t0_value !== (t0_value = /*key*/ ctx[5] + "")) set_data(t0, t0_value);

			if (/*value*/ ctx[6].range) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1$3(ctx);
					if_block0.c();
					if_block0.m(div, t2);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (typeof /*value*/ ctx[6].value === "boolean") {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$8(ctx);
					if_block1.c();
					if_block1.m(div, t3);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};
}

function create_fragment$j(ctx) {
	let each_1_anchor;
	let each_value = Object.entries(/*bot*/ ctx[0].opts());
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (dirty & /*values, Object, bot, OnChange*/ 7) {
				each_value = Object.entries(/*bot*/ ctx[0].opts());
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$6(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance$j($$self, $$props, $$invalidate) {
	let { bot } = $$props;
	let values = {};

	for (let [key, value] of Object.entries(bot.opts())) {
		values[key] = value.value;
	}

	function OnChange() {
		for (let [key, value] of Object.entries(values)) {
			bot.setOpt(key, value);
		}
	}

	function input_change_input_handler(key) {
		values[key] = to_number(this.value);
		$$invalidate(1, values);
		$$invalidate(0, bot);
	}

	function input_change_handler(key) {
		values[key] = this.checked;
		$$invalidate(1, values);
		$$invalidate(0, bot);
	}

	$$self.$set = $$props => {
		if ("bot" in $$props) $$invalidate(0, bot = $$props.bot);
	};

	return [bot, values, OnChange, input_change_input_handler, input_change_handler];
}

class Options extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-7cel4i-style")) add_css$h();
		init(this, options, instance$j, create_fragment$j, safe_not_equal, { bot: 0 });
	}
}

/* src/client/debug/ai/AI.svelte generated by Svelte v3.20.1 */

function add_css$i() {
	var style = element("style");
	style.id = "svelte-hsd9fq-style";
	style.textContent = "li.svelte-hsd9fq{list-style:none;margin:none;margin-bottom:5px}h3.svelte-hsd9fq{text-transform:uppercase}label.svelte-hsd9fq{font-weight:bold;color:#999}input[type='checkbox'].svelte-hsd9fq{vertical-align:middle}";
	append(document.head, style);
}

function get_each_context$7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (193:4) {:else}
function create_else_block$2(ctx) {
	let p0;
	let t1;
	let p1;

	return {
		c() {
			p0 = element("p");
			p0.textContent = "No bots available.";
			t1 = space();
			p1 = element("p");

			p1.innerHTML = `
        Follow the instructions
        <a href="https://boardgame.io/documentation/#/tutorial?id=bots" target="_blank">
          here</a>
        to set up bots.
      `;
		},
		m(target, anchor) {
			insert(target, p0, anchor);
			insert(target, t1, anchor);
			insert(target, p1, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(p0);
			if (detaching) detach(t1);
			if (detaching) detach(p1);
		}
	};
}

// (191:4) {#if client.multiplayer}
function create_if_block_5(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = "The bot debugger is only available in singleplayer mode.";
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (145:2) {#if client.game.ai && !client.multiplayer}
function create_if_block$9(ctx) {
	let section0;
	let h30;
	let t1;
	let li0;
	let t2;
	let li1;
	let t3;
	let li2;
	let t4;
	let section1;
	let h31;
	let t6;
	let select;
	let t7;
	let show_if = Object.keys(/*bot*/ ctx[7].opts()).length;
	let t8;
	let if_block1_anchor;
	let current;
	let dispose;

	const hotkey0 = new Hotkey({
			props: {
				value: "1",
				onPress: /*Reset*/ ctx[13],
				label: "reset"
			}
		});

	const hotkey1 = new Hotkey({
			props: {
				value: "2",
				onPress: /*Step*/ ctx[11],
				label: "play"
			}
		});

	const hotkey2 = new Hotkey({
			props: {
				value: "3",
				onPress: /*Simulate*/ ctx[12],
				label: "simulate"
			}
		});

	let each_value = Object.keys(/*bots*/ ctx[8]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
	}

	let if_block0 = show_if && create_if_block_4(ctx);
	let if_block1 = (/*botAction*/ ctx[5] || /*iterationCounter*/ ctx[3]) && create_if_block_1$4(ctx);

	return {
		c() {
			section0 = element("section");
			h30 = element("h3");
			h30.textContent = "Controls";
			t1 = space();
			li0 = element("li");
			create_component(hotkey0.$$.fragment);
			t2 = space();
			li1 = element("li");
			create_component(hotkey1.$$.fragment);
			t3 = space();
			li2 = element("li");
			create_component(hotkey2.$$.fragment);
			t4 = space();
			section1 = element("section");
			h31 = element("h3");
			h31.textContent = "Bot";
			t6 = space();
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t7 = space();
			if (if_block0) if_block0.c();
			t8 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			attr(h30, "class", "svelte-hsd9fq");
			attr(li0, "class", "svelte-hsd9fq");
			attr(li1, "class", "svelte-hsd9fq");
			attr(li2, "class", "svelte-hsd9fq");
			attr(h31, "class", "svelte-hsd9fq");
			if (/*selectedBot*/ ctx[4] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[19].call(select));
		},
		m(target, anchor, remount) {
			insert(target, section0, anchor);
			append(section0, h30);
			append(section0, t1);
			append(section0, li0);
			mount_component(hotkey0, li0, null);
			append(section0, t2);
			append(section0, li1);
			mount_component(hotkey1, li1, null);
			append(section0, t3);
			append(section0, li2);
			mount_component(hotkey2, li2, null);
			insert(target, t4, anchor);
			insert(target, section1, anchor);
			append(section1, h31);
			append(section1, t6);
			append(section1, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*selectedBot*/ ctx[4]);
			insert(target, t7, anchor);
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t8, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen(select, "change", /*select_change_handler*/ ctx[19]),
				listen(select, "change", /*ChangeBot*/ ctx[10])
			];
		},
		p(ctx, dirty) {
			if (dirty & /*Object, bots*/ 256) {
				each_value = Object.keys(/*bots*/ ctx[8]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$7(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*selectedBot*/ 16) {
				select_option(select, /*selectedBot*/ ctx[4]);
			}

			if (dirty & /*bot*/ 128) show_if = Object.keys(/*bot*/ ctx[7].opts()).length;

			if (show_if) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
					transition_in(if_block0, 1);
				} else {
					if_block0 = create_if_block_4(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(t8.parentNode, t8);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*botAction*/ ctx[5] || /*iterationCounter*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1$4(ctx);
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i(local) {
			if (current) return;
			transition_in(hotkey0.$$.fragment, local);
			transition_in(hotkey1.$$.fragment, local);
			transition_in(hotkey2.$$.fragment, local);
			transition_in(if_block0);
			current = true;
		},
		o(local) {
			transition_out(hotkey0.$$.fragment, local);
			transition_out(hotkey1.$$.fragment, local);
			transition_out(hotkey2.$$.fragment, local);
			transition_out(if_block0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section0);
			destroy_component(hotkey0);
			destroy_component(hotkey1);
			destroy_component(hotkey2);
			if (detaching) detach(t4);
			if (detaching) detach(section1);
			destroy_each(each_blocks, detaching);
			if (detaching) detach(t7);
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t8);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(if_block1_anchor);
			run_all(dispose);
		}
	};
}

// (162:8) {#each Object.keys(bots) as bot}
function create_each_block$7(ctx) {
	let option;
	let t_value = /*bot*/ ctx[7] + "";
	let t;
	let option_value_value;

	return {
		c() {
			option = element("option");
			t = text(t_value);
			option.__value = option_value_value = /*bot*/ ctx[7];
			option.value = option.__value;
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (168:4) {#if Object.keys(bot.opts()).length}
function create_if_block_4(ctx) {
	let section;
	let h3;
	let t1;
	let label;
	let t3;
	let input;
	let t4;
	let current;
	let dispose;
	const options = new Options({ props: { bot: /*bot*/ ctx[7] } });

	return {
		c() {
			section = element("section");
			h3 = element("h3");
			h3.textContent = "Options";
			t1 = space();
			label = element("label");
			label.textContent = "debug";
			t3 = space();
			input = element("input");
			t4 = space();
			create_component(options.$$.fragment);
			attr(h3, "class", "svelte-hsd9fq");
			attr(label, "class", "svelte-hsd9fq");
			attr(input, "type", "checkbox");
			attr(input, "class", "svelte-hsd9fq");
		},
		m(target, anchor, remount) {
			insert(target, section, anchor);
			append(section, h3);
			append(section, t1);
			append(section, label);
			append(section, t3);
			append(section, input);
			input.checked = /*debug*/ ctx[1];
			append(section, t4);
			mount_component(options, section, null);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen(input, "change", /*input_change_handler*/ ctx[20]),
				listen(input, "change", /*OnDebug*/ ctx[9])
			];
		},
		p(ctx, dirty) {
			if (dirty & /*debug*/ 2) {
				input.checked = /*debug*/ ctx[1];
			}

			const options_changes = {};
			if (dirty & /*bot*/ 128) options_changes.bot = /*bot*/ ctx[7];
			options.$set(options_changes);
		},
		i(local) {
			if (current) return;
			transition_in(options.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(options.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);
			destroy_component(options);
			run_all(dispose);
		}
	};
}

// (177:4) {#if botAction || iterationCounter}
function create_if_block_1$4(ctx) {
	let section;
	let h3;
	let t1;
	let t2;
	let if_block0 = /*progress*/ ctx[2] && /*progress*/ ctx[2] < 1 && create_if_block_3(ctx);
	let if_block1 = /*botAction*/ ctx[5] && create_if_block_2$2(ctx);

	return {
		c() {
			section = element("section");
			h3 = element("h3");
			h3.textContent = "Result";
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			attr(h3, "class", "svelte-hsd9fq");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, h3);
			append(section, t1);
			if (if_block0) if_block0.m(section, null);
			append(section, t2);
			if (if_block1) if_block1.m(section, null);
		},
		p(ctx, dirty) {
			if (/*progress*/ ctx[2] && /*progress*/ ctx[2] < 1) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(section, t2);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*botAction*/ ctx[5]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_2$2(ctx);
					if_block1.c();
					if_block1.m(section, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d(detaching) {
			if (detaching) detach(section);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};
}

// (180:6) {#if progress && progress < 1.0}
function create_if_block_3(ctx) {
	let progress_1;

	return {
		c() {
			progress_1 = element("progress");
			progress_1.value = /*progress*/ ctx[2];
		},
		m(target, anchor) {
			insert(target, progress_1, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*progress*/ 4) {
				progress_1.value = /*progress*/ ctx[2];
			}
		},
		d(detaching) {
			if (detaching) detach(progress_1);
		}
	};
}

// (184:6) {#if botAction}
function create_if_block_2$2(ctx) {
	let li0;
	let t0;
	let t1;
	let t2;
	let li1;
	let t3;
	let t4_value = JSON.stringify(/*botActionArgs*/ ctx[6]) + "";
	let t4;

	return {
		c() {
			li0 = element("li");
			t0 = text("Action: ");
			t1 = text(/*botAction*/ ctx[5]);
			t2 = space();
			li1 = element("li");
			t3 = text("Args: ");
			t4 = text(t4_value);
			attr(li0, "class", "svelte-hsd9fq");
			attr(li1, "class", "svelte-hsd9fq");
		},
		m(target, anchor) {
			insert(target, li0, anchor);
			append(li0, t0);
			append(li0, t1);
			insert(target, t2, anchor);
			insert(target, li1, anchor);
			append(li1, t3);
			append(li1, t4);
		},
		p(ctx, dirty) {
			if (dirty & /*botAction*/ 32) set_data(t1, /*botAction*/ ctx[5]);
			if (dirty & /*botActionArgs*/ 64 && t4_value !== (t4_value = JSON.stringify(/*botActionArgs*/ ctx[6]) + "")) set_data(t4, t4_value);
		},
		d(detaching) {
			if (detaching) detach(li0);
			if (detaching) detach(t2);
			if (detaching) detach(li1);
		}
	};
}

function create_fragment$k(ctx) {
	let section;
	let current_block_type_index;
	let if_block;
	let current;
	let dispose;
	const if_block_creators = [create_if_block$9, create_if_block_5, create_else_block$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*client*/ ctx[0].game.ai && !/*client*/ ctx[0].multiplayer) return 0;
		if (/*client*/ ctx[0].multiplayer) return 1;
		return 2;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			section = element("section");
			if_block.c();
		},
		m(target, anchor, remount) {
			insert(target, section, anchor);
			if_blocks[current_block_type_index].m(section, null);
			current = true;
			if (remount) dispose();
			dispose = listen(window, "keydown", /*OnKeyDown*/ ctx[14]);
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(section, null);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);
			if_blocks[current_block_type_index].d();
			dispose();
		}
	};
}

function instance$k($$self, $$props, $$invalidate) {
	let { client } = $$props;
	const { secondaryPane } = getContext("secondaryPane");
	const bots = { "MCTS": MCTSBot, "Random": RandomBot };
	let debug = false;
	let progress = null;
	let iterationCounter = 0;
	let metadata = null;

	const iterationCallback = ({ iterationCounter: c, numIterations, metadata: m }) => {
		$$invalidate(3, iterationCounter = c);
		$$invalidate(2, progress = c / numIterations);
		metadata = m;

		if (debug && metadata) {
			secondaryPane.set({ component: MCTS, metadata });
		}
	};

	function OnDebug() {
		if (debug && metadata) {
			secondaryPane.set({ component: MCTS, metadata });
		} else {
			secondaryPane.set(null);
		}
	}

	let bot;

	if (client.game.ai) {
		bot = new MCTSBot({
				game: client.game,
				enumerate: client.game.ai.enumerate,
				iterationCallback
			});

		bot.setOpt("async", true);
	}

	let selectedBot;
	let botAction;
	let botActionArgs;

	function ChangeBot() {
		const botConstructor = bots[selectedBot];

		$$invalidate(7, bot = new botConstructor({
				game: client.game,
				enumerate: client.game.ai.enumerate,
				iterationCallback
			}));

		bot.setOpt("async", true);
		$$invalidate(5, botAction = null);
		metadata = null;
		secondaryPane.set(null);
		$$invalidate(3, iterationCounter = 0);
	}

	async function Step$1() {
		$$invalidate(5, botAction = null);
		metadata = null;
		$$invalidate(3, iterationCounter = 0);
		const t = await Step(client, bot);

		if (t) {
			$$invalidate(5, botAction = t.payload.type);
			$$invalidate(6, botActionArgs = t.payload.args);
		}
	}

	function Simulate(iterations = 10000, sleepTimeout = 100) {
		$$invalidate(5, botAction = null);
		metadata = null;
		$$invalidate(3, iterationCounter = 0);

		const step = async () => {
			for (let i = 0; i < iterations; i++) {
				const action = await Step(client, bot);
				if (!action) break;
				await new Promise(resolve => setTimeout(resolve, sleepTimeout));
			}
		};

		return step();
	}

	function Exit() {
		client.overrideGameState(null);
		secondaryPane.set(null);
		$$invalidate(1, debug = false);
	}

	function Reset() {
		client.reset();
		$$invalidate(5, botAction = null);
		metadata = null;
		$$invalidate(3, iterationCounter = 0);
		Exit();
	}

	function OnKeyDown(e) {
		// ESC.
		if (e.keyCode == 27) {
			Exit();
		}
	}

	onDestroy(Exit);

	function select_change_handler() {
		selectedBot = select_value(this);
		$$invalidate(4, selectedBot);
		$$invalidate(8, bots);
	}

	function input_change_handler() {
		debug = this.checked;
		$$invalidate(1, debug);
	}

	$$self.$set = $$props => {
		if ("client" in $$props) $$invalidate(0, client = $$props.client);
	};

	return [
		client,
		debug,
		progress,
		iterationCounter,
		selectedBot,
		botAction,
		botActionArgs,
		bot,
		bots,
		OnDebug,
		ChangeBot,
		Step$1,
		Simulate,
		Reset,
		OnKeyDown,
		metadata,
		secondaryPane,
		iterationCallback,
		Exit,
		select_change_handler,
		input_change_handler
	];
}

class AI extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-hsd9fq-style")) add_css$i();
		init(this, options, instance$k, create_fragment$k, safe_not_equal, { client: 0 });
	}
}

/* src/client/debug/Debug.svelte generated by Svelte v3.20.1 */

function add_css$j() {
	var style = element("style");
	style.id = "svelte-1h5kecx-style";
	style.textContent = ".debug-panel.svelte-1h5kecx{position:fixed;color:#555;font-family:monospace;display:flex;flex-direction:row;text-align:left;right:0;top:0;height:100%;font-size:14px;box-sizing:border-box;opacity:0.9}.pane.svelte-1h5kecx{flex-grow:2;overflow-x:hidden;overflow-y:scroll;background:#fefefe;padding:20px;border-left:1px solid #ccc;box-shadow:-1px 0 5px rgba(0, 0, 0, 0.2);box-sizing:border-box;width:280px}.secondary-pane.svelte-1h5kecx{background:#fefefe;overflow-y:scroll}.debug-panel.svelte-1h5kecx button, select{cursor:pointer;outline:none;background:#eee;border:1px solid #bbb;color:#555;padding:3px;border-radius:3px}.debug-panel.svelte-1h5kecx button{padding-left:10px;padding-right:10px}.debug-panel.svelte-1h5kecx button:hover{background:#ddd}.debug-panel.svelte-1h5kecx button:active{background:#888;color:#fff}.debug-panel.svelte-1h5kecx section{margin-bottom:20px}";
	append(document.head, style);
}

// (109:0) {#if visible}
function create_if_block$a(ctx) {
	let div1;
	let t0;
	let div0;
	let t1;
	let div1_transition;
	let current;

	const menu = new Menu({
			props: {
				panes: /*panes*/ ctx[4],
				pane: /*pane*/ ctx[1]
			}
		});

	menu.$on("change", /*MenuChange*/ ctx[6]);
	var switch_value = /*panes*/ ctx[4][/*pane*/ ctx[1]].component;

	function switch_props(ctx) {
		return { props: { client: /*client*/ ctx[0] } };
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));
	}

	let if_block = /*$secondaryPane*/ ctx[3] && create_if_block_1$5(ctx);

	return {
		c() {
			div1 = element("div");
			create_component(menu.$$.fragment);
			t0 = space();
			div0 = element("div");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			t1 = space();
			if (if_block) if_block.c();
			attr(div0, "class", "pane svelte-1h5kecx");
			attr(div1, "class", "debug-panel svelte-1h5kecx");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			mount_component(menu, div1, null);
			append(div1, t0);
			append(div1, div0);

			if (switch_instance) {
				mount_component(switch_instance, div0, null);
			}

			append(div1, t1);
			if (if_block) if_block.m(div1, null);
			current = true;
		},
		p(ctx, dirty) {
			const menu_changes = {};
			if (dirty & /*pane*/ 2) menu_changes.pane = /*pane*/ ctx[1];
			menu.$set(menu_changes);
			const switch_instance_changes = {};
			if (dirty & /*client*/ 1) switch_instance_changes.client = /*client*/ ctx[0];

			if (switch_value !== (switch_value = /*panes*/ ctx[4][/*pane*/ ctx[1]].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, div0, null);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}

			if (/*$secondaryPane*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block_1$5(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div1, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(menu.$$.fragment, local);
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			transition_in(if_block);

			add_render_callback(() => {
				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { x: 400 }, true);
				div1_transition.run(1);
			});

			current = true;
		},
		o(local) {
			transition_out(menu.$$.fragment, local);
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			transition_out(if_block);
			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { x: 400 }, false);
			div1_transition.run(0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(menu);
			if (switch_instance) destroy_component(switch_instance);
			if (if_block) if_block.d();
			if (detaching && div1_transition) div1_transition.end();
		}
	};
}

// (115:4) {#if $secondaryPane}
function create_if_block_1$5(ctx) {
	let div;
	let current;
	var switch_value = /*$secondaryPane*/ ctx[3].component;

	function switch_props(ctx) {
		return {
			props: {
				metadata: /*$secondaryPane*/ ctx[3].metadata
			}
		};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));
	}

	return {
		c() {
			div = element("div");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr(div, "class", "secondary-pane svelte-1h5kecx");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (switch_instance) {
				mount_component(switch_instance, div, null);
			}

			current = true;
		},
		p(ctx, dirty) {
			const switch_instance_changes = {};
			if (dirty & /*$secondaryPane*/ 8) switch_instance_changes.metadata = /*$secondaryPane*/ ctx[3].metadata;

			if (switch_value !== (switch_value = /*$secondaryPane*/ ctx[3].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, div, null);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (switch_instance) destroy_component(switch_instance);
		}
	};
}

function create_fragment$l(ctx) {
	let if_block_anchor;
	let current;
	let dispose;
	let if_block = /*visible*/ ctx[2] && create_if_block$a(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor, remount) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
			if (remount) dispose();
			dispose = listen(window, "keypress", /*Keypress*/ ctx[7]);
		},
		p(ctx, [dirty]) {
			if (/*visible*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$a(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
			dispose();
		}
	};
}

function instance$l($$self, $$props, $$invalidate) {
	let $secondaryPane;
	let { client } = $$props;

	const panes = {
		main: {
			label: "Main",
			shortcut: "m",
			component: Main
		},
		log: {
			label: "Log",
			shortcut: "l",
			component: Log
		},
		info: {
			label: "Info",
			shortcut: "i",
			component: Info
		},
		ai: {
			label: "AI",
			shortcut: "a",
			component: AI
		}
	};

	const disableHotkeys = writable(false);
	const secondaryPane = writable(null);
	component_subscribe($$self, secondaryPane, value => $$invalidate(3, $secondaryPane = value));
	setContext("hotkeys", { disableHotkeys });
	setContext("secondaryPane", { secondaryPane });
	let pane = "main";

	function MenuChange(e) {
		$$invalidate(1, pane = e.detail);
	}

	let visible = true;

	function Keypress(e) {
		if (e.key == ".") {
			$$invalidate(2, visible = !visible);
			return;
		}

		Object.entries(panes).forEach(([key, { shortcut }]) => {
			if (e.key == shortcut) {
				$$invalidate(1, pane = key);
			}
		});
	}

	$$self.$set = $$props => {
		if ("client" in $$props) $$invalidate(0, client = $$props.client);
	};

	return [
		client,
		pane,
		visible,
		$secondaryPane,
		panes,
		secondaryPane,
		MenuChange,
		Keypress
	];
}

class Debug extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1h5kecx-style")) add_css$j();
		init(this, options, instance$l, create_fragment$l, safe_not_equal, { client: 0 });
	}
}

export { Debug as D };
