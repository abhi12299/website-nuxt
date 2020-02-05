import fetch from 'isomorphic-unfetch'

export function validatePostBody(body) {
  if (body.length < 100) {
    return 'Body should be more than 100 characters long!'
  }
  return ''
}

export function validatePostTitle(title) {
  if (title.length < 10) {
    return 'Title should be at least 10 characters long!'
  } else if (title.length > 200) {
    return 'Title should be at most 200 characters long!'
  } else if (!new RegExp(/^[A-Z]{1,}.*/).test(title)) {
    return 'Title must begin with uppercase letter!'
  } else if (!new RegExp(/.* .*/).test(title)) {
    return 'Title must have at least a few words!'
  }
  return ''
}

export function validateMetaDesc(desc) {
  if (desc.length < 80) {
    return 'Meta description must be at least 80 characters long!'
  } else if (desc.length > 250) {
    return 'Meta description must be at most 250 characters long!'
  } else if (!new RegExp(/^[A-Z]{1,}.*/).test(desc)) {
    return 'Meta description must begin with uppercase letter!'
  } else if (!new RegExp(/.* .*/).test(desc)) {
    return 'Meta description must have at least a few words!'
  }
}

export async function validateHeaderImageURL(url) {
  let error = ''
  try {
    url = url.trim()
    if (!url) {
      throw new Error('no url!')
    }
    const resp = await fetch(url)
    if (!resp.ok) {
      throw new Error('invalid url')
    }
  } catch (err) {
    error = 'Header image URL is invalid!'
  }
  return error
}

export function validateMetaKeywords(keywords) {
  let error = ''
  let keywordArr = keywords.split(',')
  keywordArr = keywordArr.filter((k) => k.trim().length > 0)
  if (keywordArr.length === 0) {
    error = 'Meta keywords cannot be empty'
  } else if (keywordArr.length === 1) {
    error = 'Please enter more than 1 meta keywords!'
  } else if (
    !keywordArr.every((k) => new RegExp(/^[A-Z]{1,}.*/).test(k.trim()))
  ) {
    error = 'Meta keywords must begin with upper case letter'
  }
  return error
}
