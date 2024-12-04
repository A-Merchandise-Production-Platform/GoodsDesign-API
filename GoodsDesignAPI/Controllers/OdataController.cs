﻿using BusinessObjects;
using BusinessObjects.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OdataController : Microsoft.AspNetCore.OData.Routing.Controllers.ODataController
    {
        private readonly GoodsDesignDbContext _context;

        public OdataController(GoodsDesignDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a list of users with OData support for filtering, sorting, paging, and more.
        /// </summary>
        [EnableQuery]
        [HttpGet("/api/users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                var users = await _context.Users.Include(x => x.UserRoles).ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching users.", Details = ex.Message });
            }
        }
    }
}
