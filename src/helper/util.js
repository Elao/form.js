/**
 * Smart parse from jQuery
 *
 * @param {mixed} data
 *
 * @return {mixed}
 */
function smartParse(data)
{
    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

    if (typeof data === 'string') {
        try {
            data = data === 'true' ? true :
            data === 'false' ? false :
            data === 'null' ? null :
            +data + '' === data ? +data :
            rbrace.test(data) ? jQuery.parseJSON(data) :
            data;
        } catch (e) {}
    }

    return data;
}
