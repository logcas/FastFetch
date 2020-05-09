const cookie = {
  read(cookieName: string): string | null {
    const match = document.cookie.match(new RegExp(`(${cookieName})=([^;]+)`))
    let cookie = null
    if (match) {
      cookie = match[2]
    }
    return cookie
  }
}

export default cookie
